import { Colors } from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useOAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

enum Strategy{
  Google ='oauth_google',
  Facebook ='oauth_facebook',
  Apple ='oauth_apple'
}

const Page = () => {
  const router=useRouter();
  
  const {startOAuthFlow:googleAuth} = useOAuth({strategy:Strategy.Google});
  const {startOAuthFlow:appleAuth} = useOAuth({strategy:Strategy.Apple});
  const {startOAuthFlow:facebookAuth} = useOAuth({strategy:Strategy.Facebook});

const onSelectedAuth= async(strategy:Strategy)=>{
  const onSelectedAuth={
    [Strategy.Google]:googleAuth,
    [Strategy.Apple]:appleAuth,
    [Strategy.Facebook]:facebookAuth
  }[strategy]

  try {
    const {createdSessionId,setActive}=await onSelectedAuth();
    console.log('# ~ onSeleteAuth ~ createdSessionId:',createdSessionId);

    if(createdSessionId){
      setActive!({session:createdSessionId})
      router.back();
    }
  } catch (error) {
    console.log('Error starting OAuth flow',error);
  }
}

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Login or create new an account</Text>
      <Text style={styles.subText}>By continuing, you agree to the Terms of sale ,Terms of
        service and Privacy Policy.
      </Text>
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput style={styles.input} placeholder='Email'/>
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View style={{flex:1,borderColor:'#000',borderBottomWidth:StyleSheet.hairlineWidth}}></View>
        <Text>or</Text>
        <View style={{flex:1,borderColor:'#000',borderBottomWidth:StyleSheet.hairlineWidth}}></View>
      </View>
      <View style={{gap:20}}>
        <TouchableOpacity style={styles.btnOutLine} onPress={()=>onSelectedAuth(Strategy.Google)}>
         <Ionicons name='logo-google' size={24} style={styles.btnIcon}/>
          <Text style={styles.btnOutLineText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutLine} onPress={()=>onSelectedAuth(Strategy.Facebook)}>
         <Ionicons name='logo-facebook' size={24} style={styles.btnIcon}/>
          <Text style={styles.btnOutLineText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutLine} onPress={()=>onSelectedAuth(Strategy.Apple)}>
         <Ionicons name='logo-apple' size={24} style={styles.btnIcon}/>
          <Text style={styles.btnOutLineText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Page

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    paddingHorizontal:40
  },
  header:{
    fontSize:20,
    fontWeight:'bold',
    paddingTop:30,
    paddingBottom:20,
    textAlign:'center'
  },
  subText:{
    fontSize:15,
    color:'#4f4f4f',
    textAlign:'center',
    marginBottom:30
  },
  inputLabel:{
    paddingBottom:5,
    fontWeight:'500',
  },
  input:{
    height:50,
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:8,
    paddingHorizontal:10,
    marginBottom:15,
    color:'#ccc'
  },
  seperator:{
    fontSize:16,
    color:Colors.light.gray
  },
  seperatorView:{
    flexDirection:'row',
    gap:10,
    alignItems:'center',
    marginVertical:30,
  },
  btnOutLine:{
    backgroundColor:'#fff',
    borderWidth:1,
    borderColor:'#000',
    height:50,
    borderRadius:4,
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:10,
    flexDirection:'row'
  },
  btnOutLineText:{
    color:'#000',
    fontSize:16,
    fontWeight:'500',
  },
  btnIcon:{
    paddingRight:30
  }
})