import OnScreenKeyBoard from '@/components/onScreenKeyBoard';
import SettingsModal from '@/components/SettingsModal';
import { Colors } from '@/constants/Colors';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, ZoomIn } from 'react-native-reanimated';


const ROWS = 6;

const Page = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const settingsModalRef = useRef<BottomSheetModal>(null);
  const handlePresentSettingsModal = () => settingsModalRef.current?.present();

  // const [word, setWord] = useState<string>(words[Math.floor(Math.random() * words.length)]);
  // const currentWord = words[0];
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [word, setWord] = useState<string>(() => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setUsedWords((prev) => [...prev, newWord]);
    return newWord;
  });
  const wordLetters = word.split('');

  const selectNewWord = () => {
    if (usedWords.length === words.length) {
      setUsedWords([]);
    }
    const remainingWords = words.filter((w) => !usedWords.includes(w));
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    setWord(randomWord);
    setUsedWords((prev) => [...prev, randomWord]);
  };
  useEffect(() => {
    const handleWordComplete = () => {
      if (curRow > 0 && rows[curRow - 1].join('') === word) {
        selectNewWord();
        setRows(new Array(ROWS).fill(new Array(5).fill('')));
      }
    };
    handleWordComplete();
  }, [curRow, rows, word]);


  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  }

  const addKey = (key: string) => {
    console.log('addKey', key);

    const newRows = [...rows.map((row) => [...row])];
    if (key === 'ENTER') {
      checkWord();
    } else if (key === 'BACKSPACE') {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = '';
        setRows(newRows);
        return;
      }
      newRows[curRow][colStateRef.current - 1] = '';
      setCurCol(colStateRef.current - 1);
      setRows(newRows);
      return;
    } else if (colStateRef.current >= newRows[curRow].length) {
      return;
    } else {
      newRows[curRow][colStateRef.current] = key;
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
  };
  const checkWord = () => {
    const currentWord = rows[curRow].join('');
    if (currentWord.length < word.length) {
      console.log('Kelime Çok Kısa');
      shakeRow();
      return;

    }
    if (!allWords.includes(currentWord)) {
      console.log('Kelime Bulunamadı');
      shakeRow();
      //return;
    }
    flipRow();

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split('').forEach((letter, index) => {
      if (letter == wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (currentWord === word) {
        console.log('Kazandın:Kelime bulundu');
        router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`);
      } else if (curRow + 1 >= rows.length) {
        console.log('Kaybettin:Game Over');
        router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`);
      }
    }, 1500);

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  /* const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        return Colors.light.green;
      } else if (wordLetters.includes(cell)) {
        return Colors.light.yellow;
      } else return grayColor
    }
    return 'transparent'
  };
  const getBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      return getCellColor(cell, rowIndex, cellIndex);
    }
    return Colors.light.gray;
  } */

  //!Animations
  //Sallama
  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));
  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      }
    })
  )
  const shakeRow = () => {
    const TIME = 60;
    const OFFSET = 10;
    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    )
  }
  //!Çevirme
  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  );
  const cellBackGrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue('transparent'))
  );
  const cellBorder = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray))
  );
  const tileStyles = Array.from({ length: ROWS }, (_, rowIndex) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [
            { rotateX: `${tileRotates[rowIndex][tileIndex].value}deg` },
          ],
          backgroundColor: cellBackGrounds[rowIndex][tileIndex].value,
          borderColor: cellBorder[rowIndex][tileIndex].value,
        };
      })
    );
  });

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;
    tileRotates[curRow].forEach((tileStyle, index) => {
      tileStyle.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackGrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBackGrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackGrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.gray)
        );
      }
    } else {
      cellBackGrounds[rowIndex][cellIndex].value = withTiming('transparent', { duration: 100 });
    }
  };
  const setBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      if (wordLetters[cellIndex] === cell) {
        cellBorder[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBorder[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorder[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.gray)
        );
      };
    }
  };
  useEffect(() => {
    if (curRow === 0) return;
    rows[curRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, curRow - 1, cellIndex);
      setBorderColor(cell, curRow - 1, cellIndex);
    });
  }, [curRow]);

  //?WEB
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        addKey('ENTER');
      } else if (event.key === 'Backspace') {
        addKey('BACKSPACE');
      } else if (event.key.length === 1) {
        addKey(event.key)
      }
    };
    if (Platform.OS == 'web') {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [curCol]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
      <Stack.Screen options={{
        headerRight: () => (
          <View style={styles.headerIcon}>
            <Ionicons name='help-circle-outline' size={28} color={textColor} />
            <Ionicons name='podium-outline' size={28} color={textColor} />
            <TouchableOpacity onPress={handlePresentSettingsModal}>
              <Ionicons name='settings-outline' size={28} color={textColor} />
            </TouchableOpacity>
          </View>
        )
      }} />
      <View style={styles.gameField}>
        <View>
          <Text>{word}</Text>
        </View>
        {rows.map((row, rowIndex) => (
          <Animated.View key={`row-${rowIndex}`} style={[styles.gameFieldRows, rowStyles[rowIndex]]}>
            {row.map((cell, cellIndex) => (
              <Animated.View key={`cell-wrapper-${rowIndex}-${cellIndex}`}
                entering={ZoomIn.delay(50 * cellIndex)}>
                <Animated.View
                  style={[styles.cell, tileStyles[rowIndex][cellIndex]]}
                  key={`cell-${rowIndex}-${cellIndex}`}>
                  <Text style={[styles.cellText, {
                    color: curRow > rowIndex ? '#fff' : textColor,
                  }]}>{cell}</Text>
                </Animated.View>
              </Animated.View>
            ))}
          </Animated.View>
        ))}
      </View>
      <OnScreenKeyBoard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        grayLetters={grayLetters}
        yellowLetters={yellowLetters}
      />
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40
  },
  headerIcon: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 10
  },
  gameField: {
    alignItems: 'center',
    gap: 8,

  },
  gameFieldRows: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    backgroundColor: '#fff',
    height: 62,
    width: 62,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellText: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
})