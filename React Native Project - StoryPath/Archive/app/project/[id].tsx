import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, LayoutChangeEvent } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { getProject, Project } from '@/hooks/useApi';
import { styled } from 'nativewind';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
// import { Camera, useCameraDevice, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { scanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { runOnJS } from 'react-native-reanimated';


const Tab = createBottomTabNavigator();
const StyledView = styled(View)
const StyledText = styled(Text)

function ProjectHome({ project }: { project: Project }) {
  return (
    <StyledView className="bg-slate-300 p-5 m-5 ">

      <StyledView className="flex gap-2 mt-2">
        <StyledText className="font-bold text-xl">
          Instruction
        </StyledText>
        <StyledText className="text-md">
          {project.instructions}
        </StyledText>
      </StyledView>

      <StyledView className="flex gap-2 mt-4">
        <StyledText className="font-bold text-xl">
          Inital Clue
        </StyledText>
        <StyledText className="text-md">
          {project.initial_clue}
        </StyledText>
      </StyledView>

      <StyledView className="flex flex-row justify-between mt-4">
        <StyledView className='bg-slate-800 rounded-lg w-[48%] p-2'>
          <StyledText className="font-bold text-md text-white">Points</StyledText>
          <StyledText className='text-sm text-white'>0/10</StyledText>
        </StyledView>
        <StyledView className='bg-slate-800 rounded-lg w-[48%] p-2'>
          <StyledText className="font-bold text-md text-white">Location Visited</StyledText>
          <StyledText className='text-sm text-white'> 0/10</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}

function Map() {
  const [mapRegion, setMapRegion] = useState({
    latitude: -27.4975,
    longitude: 153.0137,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: '100%', height: '100%' }}
        region={mapRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      />
    </View>
  );
}

function QRCode() {
  // const device = useCameraDevice('back')
  const [layout, setLayout] = useState<LayoutChangeEvent['nativeEvent']['layout']>({ x: 0, y: 0, width: 0, height: 0 });

  const onLayout = (evt: LayoutChangeEvent) => {
    if (evt.nativeEvent.layout) {
      setLayout(evt.nativeEvent.layout);
    }
  };

  //   const [hasPermission, setHasPermission] = useState(false);
  //   const [scannedCode, setScannedCode] = useState('');
  //   const devices = useCameraDevices();
  //   const device = devices.back;

  //   useEffect(() => {
  //     (async () => {
  //       const status = await Camera.requestCameraPermission();
  //       setHasPermission(status === 'authorized');
  //     })();
  //   }, []);

  //   const frameProcessor = useFrameProcessor((frame) => {
  //     'worklet';
  //     const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
  //     if (detectedBarcodes.length > 0) {
  //       runOnJS(setScannedCode)(detectedBarcodes[0].displayValue);
  //     }
  //   }, []);

  //   if (hasPermission === false) {
  //     return <Text>No access to camera</Text>;
  //   }

  //   if (device == null) {
  //     return <Text>Loading...</Text>;
  //   }

  return (
    // <View style={styles.container}>
    //   <Camera
    //     style={StyleSheet.absoluteFill}
    //     device={device}
    //     isActive={true}
    //     frameProcessor={frameProcessor}
    //     frameProcessorFps={5}
    //   />
    //   {scannedCode !== '' && (
    //     <View style={styles.codeContainer}>
    //       <Text style={styles.codeText}>Scanned QR Code: {scannedCode}</Text>
    //     </View>
    //   )}
    // </View>
    <View>
      {/* <Camera
        device={device}
        isActive={true}
        onLayout={onLayout}
      /> */}
    </View>
  );
}
export default function ProjectDetail() {
  const [project, setProject] = useState<Project>()

  const local = useLocalSearchParams<{ id: string }>();
  useEffect(() => {

    if (!local.id) {
      router.navigate("/projects")
    }

    async function fetchProject() {
      const fetched = await getProject(local.id)
      console.log(fetched)
      setProject(fetched[0])
    }
    fetchProject()
  }, [])
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName = "home";
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            }
            else if (route.name === 'QR') {
              iconName = focused ? 'camera' : 'camera-outline';
            }
            return <Ionicons name={iconName} size={size} color={focused ? '#7cc' : '#ccc'} />;
          },
        })}
      >
        <Tab.Screen name="Home">
          {() => project ? <ProjectHome project={project} /> : <StyledText>Loading...</StyledText>}
        </Tab.Screen>
        <Tab.Screen name="Map" component={Map} options={{ title: 'Map' }} />
        <Tab.Screen name="QR" component={QRCode} options={{ title: 'Scan' }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}



