import Icon from '@/assets/images/wordle-icon.svg';
import { Colors } from '@/constants/Colors';
import { FIRESTORE_DB } from '@/utils/FireBaseConfig';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
    const { win, word, gameField } = useLocalSearchParams<{
        win: string;
        word: string;
        gameField?: string;
    }>();

    const router = useRouter();
    const [userScore, setUserScore] = useState<any>();
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            updateHighScore();
        }
    }, [user])

    const updateHighScore = async () => {
        if (!user) return;

        const docRef = doc(FIRESTORE_DB, `highScore/${user.id}`);
        const docSnap = await getDoc(docRef);

        let newScore = {
            played: 1,
            wins: win === 'true' ? 1 : 0,
            lastGame: win === 'true' ? 'win' : 'loss',
            currentStreak: win === 'true' ? 1 : 0,
        }

        if (docSnap.exists()) {
            const data = docSnap.data();

            newScore = {
                played: data.played + 1,
                wins: win === 'true' ? data.wins + 1 : data.wins,
                lastGame: win === 'true' ? 'win' : 'loss',
                currentStreak: win === 'true' && data.lastGame === 'win' ? data.currentStreak + 1 : win === 'true',
            }
        }
        await setDoc(docRef, newScore);
        setUserScore(newScore);
    };


    const shareGame = () => {
        const game = JSON.parse(gameField!);
        const imageText: string[][] = [];

        const wordLetters = word.split('');

        game.forEach((row: string[], rowIndex: number) => {
            imageText.push([]);
            row.forEach((letter, colIndex) => {
                if (wordLetters[colIndex] === letter) {
                    imageText[rowIndex].push('🟩');
                } else if (wordLetters.includes(letter)) {
                    imageText[rowIndex].push('🟨');
                } else {
                    imageText[rowIndex].push('⬜');
                }
            })
        })
        console.log(imageText);

        const html = `
    <html>
            <head>
            <style>
    
                .game {
                display: flex;
                flex-direction: column;
                }
                .row {
                display: flex;
                flex-direction: row;
    
                }
                .cell {
                display: flex;
                justify-content: center;
                align-items: center;
                }
    
            </style>
            </head>
            <body>
            <h1>Wordle</h1>
            <div class="game">
            ${imageText
                .map(
                    (row) =>
                        `<div class="row">${row
                            .map((cell) => `<div class="cell">${cell}</div>`)
                            .join('')}</div>`
                )
                .join('')}
            </div>
            </body>
        </html>
        `;

        MailComposer.composeAsync({
            subject: `I just played Wordle!`,
            body: html,
            isHtml: true,
        });
    };
    const navigateRoot = () => {
        router.dismissAll();
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={navigateRoot} style={{ alignSelf: 'flex-start' }}>
                <Ionicons name="close" size={30} color={Colors.light.gray} />
            </TouchableOpacity>
            <View style={styles.header}>
                {win === 'true' ? (
                    <Image source={require('@/assets/images/win.png')} />
                ) : (
                    <Icon width={100} height={100} />
                )}
                <Text style={styles.title}>{
                    win === 'true' ? 'Tebrikler Kazandınız' : 'Malesef Kaybettiniz Bidahaki Sefere'
                }</Text>
                <SignedOut>
                    <Text style={styles.text}>Puanınızı görmek için giriş yapmalısınız.</Text>
                    <Link href={'/login'} style={styles.btn} asChild>
                        <TouchableOpacity>
                            <Text style={styles.btnText}>Yeni bir hesap oluşurabilirsiniz</Text>
                        </TouchableOpacity>
                    </Link>

                    <Link href={'/login'} asChild>
                        <TouchableOpacity>
                            <Text style={styles.textLink}>Önceden Hesabın varsa Giriş yap</Text>
                        </TouchableOpacity>
                    </Link>
                </SignedOut>
                {/* {win === 'true' ? (
                    <View>
                        <Text style={styles.text}>İstatiskler</Text>
                        <View style={styles.stats}>
                            <View>
                                <Text style={styles.score}>{userScore?.played}</Text>
                                <Text>Played</Text>
                            </View>
                            <View>
                                <Text style={styles.score}>{userScore?.win}</Text>
                                <Text>Wins</Text>
                            </View>
                            <View>
                                <Text style={styles.score}>{userScore?.currentStreak}</Text>
                                <Text>Current Streak</Text>
                            </View>
                        </View>
                    </View>
                ) : <></>
                } */}

                <SignedIn>
                    <Text style={styles.text}>İstatiskler</Text>
                    <View style={styles.stats}>
                        <View>
                            <Text style={styles.score}>{userScore?.played}</Text>
                            <Text>Played</Text>
                        </View>
                        <View>
                            <Text style={styles.score}>{userScore?.wins}</Text>
                            <Text>Wins</Text>
                        </View>
                        <View>
                            <Text style={styles.score}>{userScore?.currentStreak}</Text>
                            <Text>Current Streak</Text>
                        </View>
                    </View>
                </SignedIn>
                <View style={{
                    height: StyleSheet.hairlineWidth,
                    width: '110%',
                    backgroundColor: '#4e4e4e'
                }} />
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={shareGame} style={styles.iconBtn}>
                        <Text style={styles.btnText}>Share</Text>
                        <Ionicons name='share-social' size={24} color={'#fff'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        router.back();
                        router.replace('/game');
                    }} style={[styles.iconBtn]}>
                        <Text style={styles.btnText}>Tekrar Oyna</Text>
                        <Ionicons name='reload' size={24} color={'#fff'} style={{ paddingRight: 10 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, marginBottom: 20,fontStyle:'italic' }}>{win === 'true' ? '' : 'Doğru Kelime'} </Text>
                    <Text style={styles.word}>{win === 'true' ? '' : word}</Text>
                </View>
            </View>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 30,
        fontFamily: 'FrankRuhlLibre_800ExtraBold',
        textAlign: 'center',
        paddingTop: 20
    },
    text: {
        fontSize: 26,
        alignItems: 'center',
        fontFamily: 'FrankRuhlLibre_500Medium',
        textAlign: 'center',
        paddingBottom: 20
    },
    btn: {
        justifyContent: 'center',
        borderRadius: 30,
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        width: '100%',
        backgroundColor: '#000'
    },
    btnText: {
        padding: 14,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    textLink: {
        textDecorationLine: 'underline',
        fontSize: 16,
        paddingVertical: 15,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 10,
        width: '100%'
    },
    score: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    iconBtn: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.green,
        borderRadius: 30,
        width: '40%'
    },
    word: {
        fontSize: 20,
        textTransform: 'uppercase',
       /*  borderColor: '#000',
        borderRadius: 10,
        borderWidth: 1,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -1
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 20 */
    }
})