import { Image, Text, Pressable, View, TextInput, Alert, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import AppIntroSlider from "react-native-app-intro-slider";
import { COLORS, SIZES } from "@/src/constants/theme";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/src/app/firebaseConfig"; // your firebase.js file
import { Redirect, useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from 'axios'
import * as SecureStore from "expo-secure-store";
import JWT from "expo-jwt";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";



const slides = [
  {
    id: 1,
    title: "Welcome to LMS",
    description: "Find the perfect course to enhance your skills",
    Image: require("../../../assets/images/onboarding/1.png"),
    backgroundColor: "#81f8eeff",
  },
  {
    id: 2,
    title: "Set Your Own Goals",
    description:
      "Personalize your study plan with flexible timelines that suit you best",
    Image: require("../../../assets/images/onboarding/2.png"),
    backgroundColor: "#7ff85a79",
  },
  {
    id: 3,
    title: "Complete full Course",
    description:
      "Achieve certification by completing courses with dedicated effort",
    Image: require("../../../assets/images/onboarding/3.png"),
    backgroundColor: "#eb71d669",
  },
];

export default function OnBoardingScreen() {
  const [showPopup, setShowPopup] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [bg, setBg] = useState(slides[0].backgroundColor);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false); // toggle between signup/login
  const router = useRouter();

    const configureGoogleSignIn = () => {
    if (Platform.OS === "ios") {
      console.log("ios")
      // GoogleSignin.configure({
      //   iosClientId: process.env.EXPO_PUBLIC_IOS_GOOGLE_API_KEY,
      // });
    } else {
      GoogleSignin.configure({
        webClientId:
          "997703413952-9kj7lputgg0btnsug9kih7f03ds3eb5k.apps.googleusercontent.com",
            offlineAccess: true,
          // "997703413952-s1cgaqtpdhl7ikj71rk0uj6c285072ui.apps.googleusercontent.com",
      });
    }
  };

    useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const googleSignIn = async () => {
    try {
          // configureGoogleSignIn();
      await GoogleSignin.hasPlayServices();
      const userInfo:any= await GoogleSignin.signIn();
      console.log("Google sy:",userInfo);
      Alert.alert("Google")
      await authHandler({
          name: userInfo.data.user.name!,
          email: userInfo.data.user.email!,
          avatar: userInfo.data.user.photo!,
        });
      } catch (error) {
      Alert.alert("error")
      console.log(error);
    }
  };

  const authHandler = async ({
    name,
    email,
    avatar,
  }: {
    name: string;
    email: string;
    avatar: string;
  }) => {
    const user = {
      name,
      email,
      avatar,
    };
    const token = JWT.encode(
      {
        ...user,
      },
      process.env.EXPO_PUBLIC_JWT_SECRET_KEY!
    );
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/login`,
      {
        signedToken: token,
      }
    );
    await SecureStore.setItemAsync("accessToken", res.data.accessToken);
    await SecureStore.setItemAsync("name", name);
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("avatar", avatar);

    // setModalVisible(false);
router.replace("/(tabs)");
  };

    // github auth start
  const githubAuthEndpoints = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
  };

  const [request, response] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET!,
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "lmsapp",
      }),
    },
    githubAuthEndpoints
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      fetchAccessToken(code);
    }
  }, []);

  const handleGithubLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      request?.url!,
      makeRedirectUri({
        scheme: "lmsapp",
      })
    );

    if (result.type === "success" && result.url) {
      const urlParams = new URLSearchParams(result.url.split("?")[1]);
      const code: any = urlParams.get("code");
      fetchAccessToken(code);
    }
  };

  const fetchAccessToken = async (code: string) => {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}&code=${code}`,
      }
    );
    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;
    if (access_token) {
      fetchUserInfo(access_token);
    } else {
      console.error("Error fetching access token:", tokenData);
    }
  };

  const fetchUserInfo = async (token: string) => {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userResponse.json();
    await authHandler({
      name: userData.name!,
      email: userData.email!,
      avatar: userData.avatar_url!,
    });
  };
  // github auth end

  const buttonLabel = (label: string) => (
    <View style={{ padding: 12 }}>
      <Text
        style={{
          color: COLORS.title,
          fontWeight: "600",
          fontSize: SIZES.h4,
        }}
      >
        {label}
      </Text>
    </View>
  );

  // const handleAuth = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Error", "Please enter both email and password");
  //     return;
  //   }

  //   try {
  //     if (isLogin) {
  //       // Login
  //       await signInWithEmailAndPassword(auth, email, password);
  //       Alert.alert("Success", "Logged in successfully!");
  //     } else {
  //       // Sign Up
  //       await createUserWithEmailAndPassword(auth, email, password);
  //       Alert.alert("Success", "Account created successfully!");
  //     }
  //     setShowPopup(false);
  //     setEmail("");
  //     setPassword("");
  //     router.replace("/Screens/Home/Home"); // navigate to Home screen
  //   } catch (error: any) {
  //     Alert.alert("Authentication Error", error.message);
  //   }
  // };

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        data={slides}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: item.backgroundColor,
              paddingTop: 100,
              paddingHorizontal: 20,
            }}
          >
            <Image
              source={item.Image}
              style={{ width: SIZES.width - 80, height: 400 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontWeight: "bold",
                color: COLORS.title,
                fontSize: SIZES.h1,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                paddingTop: 5,
                fontWeight: "700",
                fontSize: 15,
                textAlign: "center",
                color: COLORS.title,
              }}
            >
              {item.description}
            </Text>
          </View>
        )}
        activeDotStyle={{
          backgroundColor: COLORS.primary,
          width: 20,
        }}
        showSkipButton
        renderNextButton={() => buttonLabel("Next")}
        renderSkipButton={() => buttonLabel("Skip")}
        renderDoneButton={() => buttonLabel("Done")}
        onSlideChange={(index) => setBg(slides[index].backgroundColor)}
        onDone={() => {
          const uri: any = Image.resolveAssetSource(slides[2].Image).uri;
          setBgImage(uri);
          setShowPopup(true);
        }}
      />

      {/* Popup Overlay */}
      {showPopup && bgImage && (
        <Pressable
          onPress={() => setShowPopup(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Image
            source={{ uri: bgImage }}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            blurRadius={25}
          />

          <BlurView
            intensity={50}
            tint="light"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >


           <Pressable
              style={{
                width: SIZES.width * 0.85,
                height: SIZES.height * 0.35,
                backgroundColor: "#fff",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Join LMS</Text>
              <Text style={{ fontSize: 17, paddingTop: 10, textAlign: "center" }}>
                It is easier than your imagination!
              </Text>

              <View style={{ paddingVertical: 20, flexDirection: "row", gap: 5 }}>
                <Pressable  onPress={googleSignIn}>
                  <Image
                    source={require("@/assets/images/onboarding/google.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </Pressable>

                <Pressable onPress={() => handleGithubLogin()}>
                  <Image
                    source={require("@/assets/images/onboarding/github.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </Pressable>
              </View>
            </Pressable>

          </BlurView>
        </Pressable>
      )}
    </View>
  );
}
