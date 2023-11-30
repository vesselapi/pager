/**
 * Components in this file are used as either the right
 * or left swipe actions of the alert list items
 */
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export const SwipeClose = () => {
  return (
    <View
      className="bg-green-200"
      style={{
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          marginRight: 'auto',
          marginLeft: 50,
          fontSize: 15,
          fontWeight: 'bold',
        }}
      >
        <Feather name="check" size={24} className="text-green-800" />
      </Text>
    </View>
  );
};

export const SwipeAck = () => {
  return (
    <View
      className="bg-blue-200"
      style={{
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          marginLeft: 'auto',
          marginRight: 50,
          fontSize: 15,
          fontWeight: 'bold',
        }}
      >
        <Feather name="thumbs-up" size={24} className="text-blue-800" />
      </Text>
    </View>
  );
};

export const SwipeOpen = () => {
  return (
    <View
      className="bg-red-200"
      style={{
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          marginLeft: 'auto',
          marginRight: 50,
          fontSize: 15,
          fontWeight: 'bold',
        }}
      >
        <Feather name="arrow-up-right" size={24} className="text-red-800" />
      </Text>
    </View>
  );
};

export const createSwipeAnimations = (
  status: 'OPEN' | 'ACKED' | 'CLOSED',
  {
    onAck,
    onClose,
    onReopen,
  }: { onAck: () => void; onClose: () => void; onReopen: () => void },
) => {
  if (status === 'OPEN') {
    return {
      LeftSwipe: SwipeClose,
      RightSwipe: SwipeAck,
      action: (direction: 'left' | 'right') =>
        void (direction === 'left' ? onClose() : onAck()),
    };
  } else if (status === 'ACKED') {
    return {
      LeftSwipe: SwipeClose,
      RightSwipe: SwipeOpen,
      action: (direction: 'left' | 'right') =>
        void (direction === 'left' ? onClose() : onReopen()),
    };
  }
  return {
    RightSwipe: SwipeOpen,
    action: (direction: 'left' | 'right') =>
      void (direction === 'left' ? null : onReopen()),
  };
};
