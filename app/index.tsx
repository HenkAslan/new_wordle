import Icon from "@/assets/images/wordle-icon.svg"
import SettingsModal from "@/components/SettingsModal"
import SubscribeModel from "@/components/SubscribeModel"
import ThemedText from "@/components/ThemedText"
import ThemeProvider from '@/components/ThemeProvider'
import { Colors } from "@/constants/Colors"
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { format } from 'date-fns'
import { Link } from "expo-router"
import React, { useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated"

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Page = () => {
    const colorScheme = useColorScheme();
    const backgroundColor = Colors[colorScheme ?? 'light'].background;
    const textColor = Colors[colorScheme ?? 'light'].text;
    const subscribeModalRef = useRef<BottomSheetModal>(null);
    const { signOut } = useAuth();

    const settingsModalRef = useRef<BottomSheetModal>(null);
    const handlePresentSettingsModal = () => settingsModalRef.current?.present();

    const handlePresentSubscribeModal = () => subscribeModalRef.current?.present();

    return (
        <ThemeProvider>
            <SettingsModal ref={settingsModalRef} />
            <View style={[styles.container, { backgroundColor }]}>
                <View style={styles.headerIcon}>
                    <TouchableOpacity onPress={handlePresentSettingsModal}>
                        <Ionicons name='settings-outline' size={28} color={'#000'} />
                    </TouchableOpacity>
                </View>
                <SubscribeModel ref={subscribeModalRef} />
                <Animated.View style={styles.header} entering={FadeInDown}>
                    <Icon width={100} height={70} />
                    <ThemedText style={styles.title}>Wordle</ThemedText>
                    <ThemedText style={styles.text}>5 harflik bir kelimeyi tahmin etmek için
                        6 hakınız var.
                    </ThemedText>
                </Animated.View>
                <View style={styles.menu}>
                    <Link href={'/game'} style={[styles.btn,
                    { backgroundColor: colorScheme === 'light' ? '#000' : '#4a4a4a', borderColor: textColor }]} asChild>
                        <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
                            <Text style={styles.primaryText}>Play</Text>
                        </AnimatedTouchableOpacity>
                    </Link>

                    <SignedOut>
                        <Link href={'/login'} asChild style={[styles.btn, { borderColor: textColor }]}>
                            <AnimatedTouchableOpacity entering={FadeInLeft.delay(200)}>
                                <ThemedText style={styles.btnText}>Login</ThemedText>
                            </AnimatedTouchableOpacity>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <AnimatedTouchableOpacity style={[styles.btn, { borderColor: textColor }]}
                            onPress={() => signOut()} entering={FadeInLeft.delay(200)}>
                            <ThemedText style={styles.btnText}>Sign out</ThemedText>
                        </AnimatedTouchableOpacity>
                    </SignedIn>

                    <AnimatedTouchableOpacity style={[styles.btn, { borderColor: textColor }]}
                        onPress={handlePresentSubscribeModal} entering={FadeInLeft.delay(300)}>
                        <ThemedText style={styles.btnText}>Subscribe</ThemedText>
                    </AnimatedTouchableOpacity>
                </View>
                <Animated.View style={styles.footer} entering={FadeInLeft.delay(300)}>
                    <ThemedText style={styles.footerData}>{format(new Date(), 'MMMM d, yyyy')}</ThemedText>
                    <ThemedText style={styles.footerText}>No: 222</ThemedText>
                    <ThemedText style={styles.footerText}>Made by Siwerekli82</ThemedText>
                </Animated.View>
            </View>
        </ThemeProvider>
    )
};

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 50,
        gap: 40
    },
    header: {
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 40,
        fontFamily: 'FrankRuhlLibre_800ExtraBold'
    },
    text: {
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium'
    },
    menu: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#000',
        width: 200,
    },
    btnText: {
        padding: 14,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    primaryItem: {
        backgroundColor: '#fff'
    },
    primaryText: {
        color: '#fff',
        padding: 14,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerText: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    footerData: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    headerIcon: {
        flexDirection: 'row',
        gap: 10,
        paddingRight: 10,
        alignSelf: "flex-end",
        position: "relative",
        bottom: 60,
        left: 40
    },
})