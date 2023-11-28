import { Button, View, Text } from "react-native";
import { format } from 'date-fns';

const AlertListItem = ({ alert }) => {
    const { status, title, firstName, lastName, createdAt } = alert;
    return (
        <View className={('border-b border-gray-200 px-4 py-2 flex-row justify-between')}>
            <View className={('flex-row items-center')}>
                <Text className={('text-sm rounded bg-opacity-80 px-2 font-medium')}>
                    {(status)}
                </Text>
            </View>

            <View className={('flex-row items-center')}>
                <Text className={('mr-2 text-base')}>{title}</Text>
                <Text className={('text-gray-500')}>
                    Occaeacat sint aute nulla proident nulla proident nulla proident
                    nulla proident....
                </Text>
            </View>

            <View className={('flex-row items-center justify-end')}>
                <Text className={('mr-2 font-bold text-gray-600')}>
                    {(firstName?.slice(0, 1) ?? '') + (lastName?.slice(0, 1) ?? '')}
                </Text>
                <Text className={('mr-4')}>
                    {format(createdAt, 'dd/MM p')}
                </Text>
            </View>

            <View className={('flex-row items-center justify-end')}>
                <Button title="Button" />
            </View>
        </View>
    );
};

export default AlertListItem
