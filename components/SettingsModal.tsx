import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import * as SecureStore from 'expo-secure-store';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export type Ref = BottomSheetModal;

const SettingsModal = forwardRef<Ref>((props, ref) => {
    const colorScheme = useColorScheme();
    const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');
    const [hard, setHard] = useState(false);
    const [contrast, setContrast] = useState(false);
    const snapPoints = useMemo(() => ['50%'], []);
    const { dismiss } = useBottomSheetModal();

    useEffect(() => {
        const loadSettings = async () => {
            const savedDarkMode = await SecureStore.getItemAsync('dark-mode');
            const savedHard = await SecureStore.getItemAsync('hard-mode');
            const savedContrast = await SecureStore.getItemAsync('contrast-mode');

            if (savedDarkMode !== null) setIsDarkTheme(JSON.parse(savedDarkMode));
            if (savedHard !== null) setHard(JSON.parse(savedHard));
            if (savedContrast !== null) setContrast(JSON.parse(savedContrast));
        };

        loadSettings();
    }, []);

    const toggleTheme = async () => {
        const newValue = !isDarkTheme;
        setIsDarkTheme(newValue);
        await SecureStore.setItemAsync('dark-mode', JSON.stringify(newValue));
    };

    const toggleHard = async () => {
        const newValue = !hard;
        setHard(newValue);
        await SecureStore.setItemAsync('hard-mode', JSON.stringify(newValue));
    };

    const toggleContrast = async () => {
        const newValue = !contrast;
        setContrast(newValue);
        await SecureStore.setItemAsync('contrast-mode', JSON.stringify(newValue));
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                opacity={0.2}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                {...props}
                onPress={dismiss}
            />
        ),
        []
    );

    const backgroundColor = isDarkTheme ? '#333' : '#fff';
    const textColor = isDarkTheme ? '#fff' : '#000';
    const switchTrackColor = isDarkTheme
        ? { false: '#767577', true: '#81b0ff' }
        : { false: '#767577', true: '#000' };

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}
            handleComponent={null}
        >
            <View style={[styles.contentContainer, { backgroundColor }]}>
                <View style={styles.modalBtns}>
                    <Text style={[styles.containerHeadline, { color: textColor }]}>SETTINGS</Text>
                    <TouchableOpacity onPress={() => dismiss()}>
                        <Ionicons name='close' color='#888' size={28} />
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <View style={styles.rowTex}>
                        <Text style={[styles.rowTextBig, { color: textColor }]}>Hard Mode</Text>
                        <Text style={[styles.rowTextSmall, { color: textColor }]}>Kelimeler daha uzun ve zor</Text>
                    </View>
                    <Switch
                        trackColor={switchTrackColor}
                        thumbColor={hard ? '#f4f4f4' : '#9a9a9a'}
                        ios_backgroundColor="#9a9a9a"
                        onValueChange={toggleHard}
                        value={hard}
                        style={{ height: 24 }}
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.rowTex}>
                        <Text style={[styles.rowTextBig, { color: textColor }]}>Dark Mode</Text>
                        <Text style={[styles.rowTextSmall, { color: textColor }]}>Uygulamanın temasını değiştir</Text>
                    </View>
                    <Switch
                        trackColor={switchTrackColor}
                        thumbColor={isDarkTheme ? '#f4f4f4' : '#9a9a9a'}
                        ios_backgroundColor="#9a9a9a"
                        onValueChange={toggleTheme}
                        value={isDarkTheme}
                        style={{ height: 24 }}
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.rowTex}>
                        <Text style={[styles.rowTextBig, { color: textColor }]}>High Contrast Mode</Text>
                        <Text style={[styles.rowTextSmall, { color: textColor }]}>Daha iyi görünürlük için kontrastı artırın</Text>
                    </View>
                    <Switch
                        trackColor={switchTrackColor}
                        thumbColor={contrast ? '#f4f4f4' : '#9a9a9a'}
                        ios_backgroundColor="#9a9a9a"
                        onValueChange={toggleContrast}
                        value={contrast}
                        style={{ height: 24 }}
                    />
                </View>
            </View>
        </BottomSheetModal>
    );
});

export default SettingsModal;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    containerHeadline: {
        fontSize: 18,
        textAlign: 'center',
        padding: 10,
        flex: 1,
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
    },
    modalBtns: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#888',
    },
    rowTex: {
        flex: 1,
    },
    rowTextBig: {
        fontSize: 18,
    },
    rowTextSmall: {
        fontSize: 14,
        color: '#5e5e5e',
    },
});
