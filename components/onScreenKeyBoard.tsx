import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type OnScreenKeyBoardProps = {
  onKeyPressed: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
}

export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o','ö', 'p'],
  ['a', 's', 'd', 'f', 'g', 'ç', 'h', 'j', 'k', 'l','ş','ü'],
  [ENTER, 'z', 'x', 'c','v', 'b','ö', 'n', 'm','ğ', BACKSPACE],
]

const onScreenKeyBoard = ({
  onKeyPressed,
  greenLetters,
  yellowLetters,
  grayLetters,
}: OnScreenKeyBoardProps) => {

  const { width } = useWindowDimensions();
  const keyWidth = Platform.OS === 'web' ? 58 : (width - 70) / keys[0].length;
  const keyHeight = 45;

  const isSpecialKey = (key: string) => [ENTER, BACKSPACE].includes(key);

  const isInLetters = (key: string) => [...greenLetters, ...yellowLetters, ...grayLetters].includes(key);
  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, keyIndex) => (
            <Pressable key={`key-${key}`} onPress={() => onKeyPressed(key)}
              style={({ pressed }) => [styles.key, { width: keyWidth, height: keyHeight, backgroundColor: '#ddd' },
              isSpecialKey(key) && { width: keyWidth * 2.0 },
              pressed && { backgroundColor: '#868686' },
              {
                backgroundColor: greenLetters.includes(key)
                  ? Colors.light.green
                  : yellowLetters.includes(key)
                    ? Colors.light.yellow
                    : grayLetters.includes(key)
                      ? Colors.light.gray
                      : '#ddd'
              }
              ]}>
              <Text style={[styles.keyText, key == 'ENTER' && { fontSize: 12 },
              isInLetters(key) && { color: '#fff' }
              ]}>{
                  isSpecialKey(key) ? (
                    key === 'ENTER' ? ('ENTER') :
                      (<Ionicons name='backspace-outline' size={24} color={'black'} />)
                  ) : (key)
                }</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  )
}

export default onScreenKeyBoard

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 4,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
  },
  key: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  keyText: {
    fontWeight: 'bold',
    fontSize: 17,
    textTransform: 'uppercase'
  }
})