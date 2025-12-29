import { Ionicons } from "@expo/vector-icons"
import { Text, View, Image, TouchableOpacity, Button, Modal, Pressable, TextInput } from "react-native"
import { styled } from 'nativewind';
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren } from "react";

const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledButton = styled(Button)
const StyledTextInput = styled(TextInput)
const StylePressable = styled(Pressable)

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

function UsernamePicker({ isVisible, children, onClose }: Props) {
  return (
    <Modal animationType="fade" visible={isVisible}>
      <StyledView className="absolute top-20 w-full  bg-white shadow-lg rounded-lg">
        <StyledView className="h-[20%] bg-gray-200 rounded-t-md px-5 flex-row items-center justify-between">
          <Text>Set your username</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" color="#333" size={30} />
          </Pressable>
        </StyledView>
        <StyledView className="p-4">
          {children}
        </StyledView>
      </StyledView>
    </Modal>
  );
}

export default function () {
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Unset Username");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);


  const onChangeUsername = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const [newUsername, setNewUsername] = useState<string>("");

  const handleUsernameChange = (text: string) => {
    setNewUsername(text);
  };

  const saveUsername = async () => {
    setUsername(newUsername);
    await AsyncStorage.setItem('username', newUsername);
    onModalClose();
  };


  useEffect(() => {
    const fetchImage = async () => {
      const value = await AsyncStorage.getItem('profile-picture');
      setImage(value);

      const username = await AsyncStorage.getItem('username');
      if (username)
        setUsername(username)
    };
    fetchImage();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem('profile-picture', result.assets[0].uri);
    }
  };
  return (
    <StyledView className="flex items-center pt-10 flex-col justify-between">
      {image ?
        <TouchableOpacity onPress={pickImage}>
          <StyledImage className="rounded-full ring-slate-700 w-40 h-40" source={{ uri: image }} />
        </TouchableOpacity> :
        <Ionicons
          name="person"
          size={100}
          color={'#ccc'}
          onPress={pickImage}
        />
      }
      <StyledView className="max-w-lg flex flex-col mt-10">
        <StyledText className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >{username}</StyledText>
      </StyledView>
      <StyledButton title="Change username" className="border border-gray-300 mt-auto" onPress={onChangeUsername} />
      <UsernamePicker isVisible={isModalVisible} onClose={onModalClose}>
        <StyledTextInput
          value={newUsername}
          onChangeText={handleUsernameChange}
          placeholder="Enter new username"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
        />
        <StylePressable className="mt-10 w-full bg-green-300 flex items-center justify-center p-2 rounded-lg" onPress={saveUsername}>
          <Ionicons
            name="save" color="#ffffff" size={20}
          />
        </StylePressable>
      </UsernamePicker>
    </StyledView>
  )
}
