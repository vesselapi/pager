import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

const StatusToColor = {
  ACKED: 'text-blue-800 bg-blue-200',
  OPEN: 'text-red-800 bg-red-200',
  CLOSED: 'text-green-800 bg-green-200',
};

const Swipe = (color, text) => (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [-200, 0],
    outputRange: [1, 0.5],
  });
  return (
    <Animated.View
      style={{
        backgroundColor: color,
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Animated.Text
        style={{
          marginLeft: 'auto',
          marginRight: 50,
          fontSize: 15,
          fontWeight: 'bold',
          transform: [{ scale }],
        }}
      >
        {text}
      </Animated.Text>
    </Animated.View>
  );
};


const SwipeRight = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [-200, 0],
    outputRange: [0.5, 1],
  });
  return (
    <Animated.View
      style={{
        backgroundColor: 'red',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Animated.Text
        style={{
          marginRight: 'auto',
          marginLeft: 50,
          fontSize: 15,
          fontWeight: 'bold',
          transform: [{ scale }],
        }}
      >
        <Feather name="check" size={24} color="black" />
        <Text>
          Open
        </Text>
      </Animated.Text>
    </Animated.View>
  );
};


const createSwipeAnimations = (status: 'OPEN' | 'ACKED' | 'CLOSED', { onAck, onClose, onReopen }) => {
  if (status === 'OPEN') {
    return {
      left: SwipeRight,
      right: Swipe('#ADD8E6', 'Ack'),
      action: (direction: 'left' | 'right') => void (direction === 'left' ? onClose() : onAck())
    }
  } else if (status === 'ACKED') {
    return {
      left: Swipe('#008000', 'Close'),
      right: Swipe('#FFCCCC', 'Re-Open'),
      action: (direction: 'left' | 'right') => void (direction === 'left' ? onClose() : onReopen())

    }
  } else if (status === 'CLOSED') {
    return {
      left: null,
      right: Swipe('#FFCCCC', 'Re-Open'),
      action: (direction: 'left' | 'right') => void (direction === 'left' ? null : onReopen())
    }
  }
}

const AlertListItem = ({
  alert,
  user,
  onAck,
  onClose,
  onReopen,
  onSelfAssign,
}) => {
  const { status, title, createdAt } = alert;
  const { firstName, lastName } = user;


  const { left, right, action } = createSwipeAnimations(status, { onAck, onClose, onReopen })

  return (
    <Swipeable
      renderRightActions={right}
      renderLeftActions={left}
      onSwipeableOpen={action}
    >
      <Animated.View className="pb-8 px-4 pt-2 bg-white">
        <View className={'flex-row justify-between'}>
          <View className={'flex-row items-center'}>
            <View
              className={`mr-4 w-[60px] rounded bg-opacity-80 py-0.5 ${StatusToColor[status]}`}
            >
              <Text
                className={`text-center text-sm font-medium capitalize ${StatusToColor[status]}`}
              >
                {status}
              </Text>
            </View>
          </View>

          <View>
            <Text className={'mb-1.5 mr-2 text-lg font-medium'}>{title}</Text>
            <Text className={'w-3/4 text-sm text-gray-500'}>
              Occaeacat sint aute nulla proident nulla proident nulla proident
              nulla proident....
            </Text>
          </View>
        </View>
        <View className={'absolute right-0 top-3 flex-row items-center '}>
          <Text className={'mr-4 text-sm'}>{format(createdAt, 'dd/MM p')}</Text>
        </View>

        <View className={'absolute bottom-4 right-2 flex-row items-center '}>
          <Text className={'mr-1 text-sm font-bold text-gray-600'}>
            {(firstName?.slice(0, 1) ?? '') + (lastName?.slice(0, 1) ?? '')}
          </Text>
          <TouchableOpacity onPress={onSelfAssign}>
            <Ionicons name="md-hand-right-outline" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Swipeable>
  );
};

export default AlertListItem;
