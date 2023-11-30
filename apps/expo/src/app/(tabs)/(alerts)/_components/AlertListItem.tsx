import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Alert, User } from '../alerts.types';
import { createSwipeAnimations } from './AlertListItemActionButtons';

const StatusToColor = {
  ACKED: { view: 'bg-blue-200', text: 'text-blue-800' },
  OPEN: { view: 'bg-red-200', text: 'text-red-800' },
  CLOSED: { view: 'bg-green-200', text: 'text-green-800' },
};

const AlertListItem = ({
  alert,
  user,
  onAck,
  onClose,
  onReopen,
  onSelfAssign,
}: {
  alert: Alert;
  user: User;
  onAck: () => void;
  onClose: () => void;
  onReopen: () => void;
  onSelfAssign: () => void;
}) => {
  const { status, title, createdAt } = alert;
  const { firstName, lastName } = user;

  const StatusColors = StatusToColor[status as keyof typeof StatusToColor];
  const { LeftSwipe, RightSwipe, action } = createSwipeAnimations(status, {
    onAck,
    onClose,
    onReopen,
  });

  return (
    <Swipeable
      renderRightActions={RightSwipe}
      renderLeftActions={LeftSwipe}
      onSwipeableOpen={action}
    >
      <Animated.View className="pb-8 px-4 pt-2 bg-white">
        <View className={'flex-row justify-between'}>
          <View className={'flex-row items-center'}>
            <View
              className={`mr-4 w-[60px] rounded bg-opacity-80 py-0.5 ${StatusColors.view}`}
            >
              <Text
                className={`text-center text-sm font-medium capitalize ${StatusColors.text}`}
              >
                {status}
              </Text>
            </View>
          </View>

          <View>
            <Text className={'mb-1.5 mr-2 text-lg font-medium w-[220px]'} numberOfLines={1}>{title}</Text>
            <Text className={'w-[65%] text-sm text-gray-500 overflow-ellipsis overflow-hidden'}>
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
