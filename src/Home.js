import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  ToastAndroid,
  Modal,
  Dimensions,
} from 'react-native';
import {Divider, Snackbar, TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native-gesture-handler';
function Home(props) {
  const [state, setstate] = useState({
    loading: false,
    id: 0,
    title: '',
    about: '',
    data: [],
    visible: false,
    check: [],
    editshowid: null,
    showmodal: false,
    editid: null,
    edittitle: '',
    editabout: '',
    deletebox: false,
    deleteid: null,
  });
  async function getStorageObject(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (e) {
      console.log(e);
    }
  }
  const getInfo = () => {
    getStorageObject('settingindex').then(index => {
      getStorageObject('taskdata').then(result => {
        if (result) {
          setstate(prevs => ({
            ...prevs,
            data: [...prevs.data, ...result],
            id: index,
          }));
        }
      });
    });
  };
  useEffect(() => getInfo(), []);

  async function setStorageObject(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  }
  const deleteTask = async ({taskId}) => {
    const taskIndex = state.data.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      const newData = [
        ...state.data.slice(0, taskIndex),
        ...state.data.slice(taskIndex + 1),
      ];
      setstate(prevs => ({
        ...prevs,
        data: newData,
        deletebox: false,
      }));
      await setStorageObject('taskdata', newData);
    }
  };

  const CreateTask = () => {
    if (state.title === '') {
      Alert.alert('Alert!', 'Please fill title to continue. ');
    } else if (state.about === '') {
      Alert.alert('Alert!', 'Please fill about to continue.');
    } else if (state.title.length > 0 && state.about.length > 0) {
      const newTask = {
        id: state.id + 1,
        title: state.title,
        about: state.about,
      };
      setstate(prevs => ({
        ...prevs,
        data: [...prevs.data, newTask],
        visible: true,
        id: state.id + 1,
        title: '',
        about: '',
      }));
      setStorageObject('taskdata', [...state.data, newTask]).then(() =>
        setStorageObject('settingindex', state.id + 1),
      );
    }
  };

  const updateTask = async ({taskId, newTitle, newAbout}) => {
    const taskIndex = state.data.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      const updatedTask = {
        ...state.data[taskIndex],
        title: newTitle,
        about: newAbout,
      };
      const newData = [
        ...state.data.slice(0, taskIndex),
        updatedTask,
        ...state.data.slice(taskIndex + 1),
      ];
      setstate(prevs => ({
        ...prevs,
        data: newData,
        showmodal: false,
      }));
      await setStorageObject('taskdata', newData);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableRipple
          rippleColor={'white'}
          onPress={() => null}
          onLongPress={() =>
            setstate(prevs => ({...prevs, editshowid: item?.id}))
          }
          style={{
            borderWidth: 1,
            borderColor: '#A35709',
            padding: 10,
            borderRadius: 10,
            marginBottom: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{color: 'white', fontSize: 18}}>{item?.title}</Text>
              <Text style={{color: 'white'}}>{item?.about}</Text>
            </View>
            <TouchableRipple
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#A35709',
              }}
              rippleColor={'white'}
              onPress={() =>
                setstate(prevs => ({
                  ...prevs,
                  deletebox: true,
                  deleteid: item?.id,
                }))
              }>
              <Icon name={'cross'} color="#FF8303" size={23} />
            </TouchableRipple>
          </View>
        </TouchableRipple>
        {state.editshowid == item?.id && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 10,
            }}>
            <TouchableRipple
              rippleColor={'white'}
              onPress={() =>
                setstate(prevs => ({
                  ...prevs,
                  showmodal: true,
                  editid: item?.id,
                  edittitle: item?.title,
                  editabout: item?.about,
                }))
              }
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#A35709',
                padding: 10,
                marginRight: 5,
                borderRadius: 5,
              }}>
              <Icon name={'edit'} color="#FF8303" size={23} />
            </TouchableRipple>
            <TouchableRipple
              rippleColor={'white'}
              onPress={() =>
                setstate(prevs => ({
                  ...prevs,
                  showmodal: true,
                  editid: item?.id,
                  edittitle: item?.title,
                  editabout: item?.about,
                }))
              }
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#A35709',
                padding: 10,
                borderRadius: 5,
              }}>
              <Icon2 name={'information'} color="#FF8303" size={23} />
            </TouchableRipple>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{flex: 1}}>
          <TextInput
            value={state.title}
            style={{
              borderRadius: 10,
              paddingLeft: 10,
              borderWidth: 1,
              borderColor: '#A35709',
              marginBottom: 10,
            }}
            placeholder="Title..."
            cursorColor={'#A35709'}
            onChangeText={e =>
              setstate(prevs => ({...prevs, title: e.trimStart()}))
            }
          />
          <TextInput
            value={state.about}
            style={{
              borderRadius: 10,
              paddingLeft: 10,
              borderWidth: 1,
              borderColor: '#A35709',
            }}
            placeholder="About..."
            cursorColor={'#A35709'}
            onChangeText={e =>
              setstate(prevs => ({...prevs, about: e.trimStart()}))
            }
          />
        </View>
        <TouchableRipple
          style={{
            borderWidth: 2,
            borderColor: '#FF8303',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30,
            marginLeft: 20,
            borderRadius: 10,
          }}
          rippleColor={'white'}
          onPress={() => CreateTask()}>
          <Icon name={'plus'} color="#FF8303" size={23} />
        </TouchableRipple>
      </View>
      <View style={{position: 'relative', zIndex: 10}}>
        <Snackbar
          style={{
            position: 'absolute',
            top: 490,
            left: 1,
          }}
          visible={state.visible}
          onDismiss={() => setstate(prevs => ({...prevs, visible: false}))}
          action={{
            label: 'ok',
            onPress: () => setstate(prevs => ({...prevs, visible: false})),
          }}>
          Successfully created a task
        </Snackbar>
      </View>
      <FlatList
        data={state.data}
        keyExtractor={item => item?.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{marginTop: 50, paddingBottom: 60}}
        ListEmptyComponent={
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Divider
              style={{
                padding: 2,
                borderRadius: 10,
                backgroundColor: '#FF8303',
                width: '20%',
                marginBottom: 8,
              }}
            />
            <Text style={{fontSize: 24}}>No Task</Text>
            <Divider
              style={{
                marginTop: 12,
                padding: 2,
                borderRadius: 10,
                backgroundColor: '#FF8303',
                width: '20%',
              }}
            />
          </View>
        }
      />
      <Modal animationType="fade" transparent={true} visible={state.showmodal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            top: 0,
            bottom: -240,
            left: 0,
            right: 0,
          }}>
          <View
            style={{
              position: 'relative',
              backgroundColor: '#1B1A17',
              padding: 6,
              alignSelf: 'center',
              width: Dimensions.get('screen').width * 0.95,
              // height: Dimensions.get('screen').height * 0.55,
              borderRadius: 10,
              elevation: 5,
              marginHorizontal: 3,
            }}>
            <TextInput
              style={{
                margin: 5,
                color: 'white',
                borderWidth: 1,
                borderColor: '#A35709',
                paddingLeft: 10,
                borderRadius: 10,
              }}
              value={state.edittitle}
              onChangeText={e => setstate(prevs => ({...prevs, edittitle: e}))}
              placeholder="input"
            />
            <TextInput
              style={{
                margin: 5,
                color: 'white',
                borderWidth: 1,
                borderColor: '#A35709',
                paddingLeft: 10,
                paddingBottom: 240,
                borderRadius: 10,
              }}
              onChangeText={e => setstate(prevs => ({...prevs, editabout: e}))}
              value={state.editabout}
              placeholder="input"
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableRipple
                style={{
                  borderWidth: 1,
                  borderColor: '#A35709',
                  padding: 10,
                  paddingHorizontal: 25,
                  borderRadius: 10,
                  marginRight: 10,
                }}
                onPress={() =>
                  setstate(prevs => ({...prevs, showmodal: false}))
                }
                rippleColor={'white'}>
                <Text style={{color: 'white'}}>Cancel</Text>
              </TouchableRipple>
              <TouchableRipple
                style={{
                  borderWidth: 1,
                  borderColor: '#A35709',
                  paddingHorizontal: 25,
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() =>
                  updateTask({
                    taskId: state.editid,
                    newTitle: state.edittitle,
                    newAbout: state.editabout,
                  })
                }
                rippleColor={'white'}>
                <Text style={{color: 'white'}}>Save</Text>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={state.deletebox}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            top: 0,
            bottom: -240,
            left: 0,
            right: 0,
          }}>
          <View
            style={{
              position: 'relative',
              backgroundColor: '#1B1A17',
              padding: 6,
              alignSelf: 'center',
              width: Dimensions.get('screen').width * 0.95,
              // height: Dimensions.get('screen').height * 0.55,
              borderRadius: 10,
              elevation: 5,
              marginHorizontal: 3,
            }}>
            <Text>Delete the task?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableRipple
                style={{
                  borderWidth: 1,
                  borderColor: '#A35709',
                  paddingHorizontal: 25,
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => deleteTask({taskId: state?.deleteid})}
                rippleColor={'white'}>
                <Text style={{color: 'white'}}>Yes</Text>
              </TouchableRipple>
              <TouchableRipple
                style={{
                  borderWidth: 1,
                  borderColor: '#A35709',
                  paddingHorizontal: 25,
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() =>
                  setstate(prevs => ({...prevs, deletebox: false}))
                }
                rippleColor={'white'}>
                <Text style={{color: 'white'}}>No</Text>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    position: 'relative',
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 10,
    backgroundColor: '#1B1A17',
  },
});
export default Home;
