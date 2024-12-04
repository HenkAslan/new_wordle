import { Colors } from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import disc from '@jsamr/counter-style/presets/disc';
import MarkedList from '@jsamr/react-native-li';
import { Link } from 'expo-router';
import { forwardRef, useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type Ref = BottomSheetModal;


const SubscribeModel = forwardRef<Ref>((props, ref) => {
  const BENEFITS = [
    'Wordle, Spelling Bee, The Crossword ve daha fazlasına tam erişimin keyfini çıkarın.',
    'Konsantrasyon veya rahatlama için her gün yeni bulmacalar oynayın.',
    'Stratejinizi WordleBot ile güçlendirin.',
    "Wordle, Spelling Bee ve bulmaca arşivlerimizde 10.000'den fazla bulmacanın kilidini açın.",
    'İstatistiklerinizi ve serilerinizi herhangi bir cihazdan takip edin.',
    "Hepsinden önce bir Siverek'e uğremayı unutmayın."
  ];


  const snapPoints = useMemo(() => ['90%'], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      opacity={0.2}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      {...props}
      onPress={dismiss}
    />
  ), [])

  return <BottomSheetModal
    ref={ref}
    index={0}
    backdropComponent={renderBackdrop}
    snapPoints={snapPoints}
    handleComponent={null}
  >
    <View style={styles.contentContainer}>
      <View style={styles.modalBtns}>
        <Link href={'/login'} asChild>
          <TouchableOpacity onPress={()=>dismiss()}>
            <Text style={styles.btnText}>LOG IN</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={() => dismiss()}>
          <Ionicons name='close' color={Colors.light.gray} size={28} />
        </TouchableOpacity>
      </View>
      <BottomSheetScrollView>
        <Text style={styles.containerHeadline}>
          Oyunu en iyi seviyede oyna.{'\n'}
          Üstelik 7 gün ücretsiz
        </Text>
        <Image source={require('@/assets/images/games.png')} style={styles.image} />
        <View style={{ marginVertical: 20 }}>
          <MarkedList counterRenderer={disc} lineStyle={{
            paddingHorizontal: 40,
            gap: 10,
            marginVertical: 10
          }}>
            {BENEFITS.map((value, index) => (
              <Text key={index} style={styles.listText}>{value}</Text>
            ))}
          </MarkedList>
        </View>
        <Text style={styles.disclaimer}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Text>
      </BottomSheetScrollView>
      <View style={[styles.footer,{paddingBottom:bottom}]}>
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>7 gün ücretsiz</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>7 gün ücretsiz denedikten sonra 2.99€/month.{'\n'}İstediğin zaman iptal et</Text>
      </View>
    </View>
  </BottomSheetModal>
})

export default SubscribeModel

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  containerHeadline: {
    fontSize: 34,
    textAlign: 'center',
    padding: 20,
    fontFamily: 'FrankRuhlLibre_900Black',
  },
  modalBtns: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center'
  },
  btnText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  },
  image: {
    width: '90%',
    alignSelf: 'center',
    height: 40
  },
  listText: {
    fontSize: 14,
    color: '#4f4f4f',
    flexShrink: 1
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#484848',
    marginHorizontal: 30,
    lineHeight: 18,
    marginBottom: 20,
  },
  footer:{
    backgroundColor:'#fff',
    paddingHorizontal:20,
    paddingTop:20,
    shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:-1
    },
    shadowOpacity:0.1,
    shadowRadius:6,
    elevation:5
  },
  footerText:{
    fontSize:14,
    textAlign:'center',
    paddingTop:10,
  }
})