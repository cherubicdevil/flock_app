const MemberPics = ({memberIds}) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const [membersData, setMembersData] = useState([]);

  console.log(membersData, memberIds);
  useEffect(()=>{
    console.log(memberIds, 'undefined?');
    fetch('https://us-central1-flock-46ffc.cloudfunctions.net/getUsers', {
      method: 'POST',
      body: JSON.stringify({"membersIds": memberIds || []}),
      headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json()
  .then((json)=>{
    setMembersData(json.result);
  }).catch((err)=>console.log('error one',err))
  ).catch(err=>console.log('errrorrr',err))
    
  },[]);
  // return <Text>hi</Text>
  return <View
  style={{
    width: '100%',
    top: 0,

    //backgroundColor: constants.TRANSLUCENT,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
  }}>
    

  
          <TouchableOpacity onPress={()=>{ setCollapsed(!collapsed); }}>
            <Text style={{marginLeft: 20, marginTop: 10}}>Your co-flockers <Icon name="chevron-down" /></Text>
          </TouchableOpacity>
  <View style={{marginHorizontal: 20}}>
  
  <Collapsible collapsed={collapsed}>
    <ScrollView horizontal >
  {membersData.map((item)=>{
    const name = item.displayName;
    const picture = item.photoURL;
  return <View key={item.displayName}>
  <Image
  defaultSource={constants.PLACEHOLDER_IMAGE}
    style={{
      height: 46,
      marginRight: 10,
      marginTop: 10,
      width: 46,
      borderWidth: 3,
      borderColor:
        'transparent',
      borderRadius: 50,
    }}
    source={{uri: picture}}
  />
  <Text
    numberOfLines={1}
    style={{
      color: 'black',
      fontSize: 10,
      width: 48,
      textAlign: 'center',
      overflow: 'hidden',
    }}>
    {name}
  </Text>
</View>;
  })}
      </ScrollView>
      </Collapsible>
  </View>

</View>
};