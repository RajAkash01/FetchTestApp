import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  DataTable,
  Divider,
  RadioButton,
  SegmentedButtons,
  TouchableRipple,
} from 'react-native-paper';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome';
import Icon3 from 'react-native-vector-icons/dist/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ScrollView} from 'react-native-gesture-handler';
function Home(props) {
  const [radiovalue, setradioValue] = React.useState('key-value');
  const [state, setstate] = useState({
    loading: false,
    data: [],
    filtervalue: [],
  });
  const fetchData = async () => {
    try {
      setstate(prevs => ({...prevs, loading: true}));
      const response = await fetch(
        'https://harpreetcd.github.io/reactnative.json',
      );
      if (!response.ok) {
        throw new Error('Network request failed');
      }
      const result = await response.json();
      setstate(prevs => ({
        ...prevs,
        data: result,
        filtervalue: result.report?.favourablePoints,
      }));
    } catch (error) {
      console.log(error.message);
    } finally {
      setstate(prevs => ({...prevs, loading: false}));
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (radiovalue == 'key-value') {
      setstate(prevs => ({
        ...prevs,
        filtervalue: prevs.data?.report?.favourablePoints,
      }));
    } else if (radiovalue == 'paragraph') {
      setstate(prevs => ({
        ...prevs,
        filtervalue: prevs.data?.report?.numerologyReport,
      }));
    } else if (radiovalue == 'key-paragraph') {
      setstate(prevs => ({
        ...prevs,
        filtervalue: prevs.data?.report?.ascendantReport,
      }));
    } else {
      setstate(prevs => ({
        ...prevs,
        filtervalue: prevs.data?.houseCuspsAndSandhi[0]?.data,
      }));
    }
  }, [radiovalue]);

  const renderItem = ({item, index}) => {
    return (
      <View style={{marginHorizontal: 10, padding: 10}}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'black',
            marginVertical: 2,
          }}>
          {item?.heading}
        </Text>
        <Text style={{textAlign: 'justify', color: 'black'}}>
          {'Type: ' + item?.type}
        </Text>
        {item?.type == 'PARAGRAPH' && (
          <Text
            style={{textAlign: 'justify', marginVertical: 2, color: 'black'}}>
            {item?.data[0]}
          </Text>
        )}
        {item?.type == 'KEY_PARAGRAPH' && (
          <>
            <Text
              style={{textAlign: 'justify', marginVertical: 2, color: 'black'}}>
              {item?.data?.ascendant}
            </Text>
            <Text
              style={{textAlign: 'justify', marginVertical: 2, color: 'black'}}>
              {item?.data?.report}
            </Text>
          </>
        )}
      </View>
    );
  };

  const RenderTable = ({data}) => {
    const itemsPerPage = 6;
    const [page, setPage] = useState(0);
    const rowkeys = data[0]?.data != undefined && Object.entries(data[0].data);
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, rowkeys.length);
    const items = rowkeys;
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title textStyle={{color: 'black'}}>Key</DataTable.Title>
          <DataTable.Title textStyle={{color: 'black'}}>Value</DataTable.Title>
        </DataTable.Header>

        {rowkeys?.length > 0 &&
          rowkeys.slice(from, to)?.map(([key, value]) => (
            <>
              <DataTable.Row key={key}>
                <DataTable.Cell textStyle={{color: 'black'}} key={key}>
                  {key}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{color: 'black'}} key={value}>
                  {value}
                </DataTable.Cell>
              </DataTable.Row>
            </>
          ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPage={itemsPerPage}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
          style={{backgroundColor: 'black'}}
        />
      </DataTable>
    );
  };

  const RenderTable2 = ({data}) => {
    const itemsPerPage = 6;
    const [page, setPage] = useState(0);
    const rowkeys = data?.length > 0 && data;
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, rowkeys.length);
    const items = rowkeys;
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title
            textStyle={{color: 'black'}}
            style={{marginLeft: -7}}>
            {'House'}
          </DataTable.Title>
          <DataTable.Title
            textStyle={{color: 'black'}}
            style={{marginLeft: -7}}>
            {'Degree'}
          </DataTable.Title>
          <DataTable.Title textStyle={{color: 'black'}}>
            {'Sign'}
          </DataTable.Title>
          <DataTable.Title
            textStyle={{color: 'black'}}
            style={{marginLeft: -27}}>
            {'Sign Lord'}
          </DataTable.Title>
          <DataTable.Title
            textStyle={{color: 'black'}}
            style={{marginLeft: -5}}>
            {'Start Lord'}
          </DataTable.Title>
          <DataTable.Title
            textStyle={{color: 'black'}}
            style={{marginLeft: -5}}>
            {'Sub Lord'}
          </DataTable.Title>
        </DataTable.Header>

        {rowkeys?.length > 0 &&
          rowkeys.slice(from, to)?.map((item, index) => (
            <View>
              <DataTable.Row key={index}>
                <DataTable.Cell textStyle={{color: 'black'}}>
                  {item?.house}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={{color: 'black'}}
                  style={{marginLeft: -35, marginRight: 5}}>
                  {item?.degree}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{color: 'black'}}>
                  {item?.sign}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{color: 'black'}}>
                  {item?.sign_lord}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{color: 'black'}}>
                  {item?.start_lord}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{color: 'black'}}>
                  {item?.sub_lord}
                </DataTable.Cell>
              </DataTable.Row>
            </View>
          ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPage={itemsPerPage}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
          style={{backgroundColor: 'black'}}
        />
      </DataTable>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 60,
          marginBottom: -20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Fetch Test App</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'white',
          marginTop: 70,
          paddingTop: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 2,
            borderColor: 'grey',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          <TouchableRipple
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginTop: -10,
              marginBottom: -10,
              marginRight: -2,
              backgroundColor: radiovalue == 'key-value' ? 'black' : 'white',
            }}
            rippleColor={'white'}
            onPress={() => setradioValue('key-value')}>
            <Text
              style={{
                color: radiovalue == 'key-value' ? 'white' : 'black',
                fontWeight: 'bold',
              }}>
              Key Value
            </Text>
          </TouchableRipple>
          <View
            style={{
              height: '100%',
              borderWidth: 1,
              borderColor: 'grey',
              marginHorizontal: 2,
            }}
          />
          <TouchableRipple
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginTop: -10,
              marginBottom: -10,
              marginRight: -2,
              backgroundColor: radiovalue == 'paragraph' ? 'black' : 'white',
            }}
            rippleColor={'white'}
            onPress={() => setradioValue('paragraph')}>
            <Text
              style={{
                color: radiovalue == 'paragraph' ? 'white' : 'black',
                fontWeight: 'bold',
              }}>
              Paragraph
            </Text>
          </TouchableRipple>
          <View
            style={{
              height: '100%',
              borderWidth: 1,
              borderColor: 'grey',
              marginHorizontal: 2,
            }}
          />
          <TouchableRipple
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginTop: -10,
              marginBottom: -10,
              marginRight: -2,
              backgroundColor:
                radiovalue == 'key-paragraph' ? 'black' : 'white',
            }}
            rippleColor={'white'}
            onPress={() => setradioValue('key-paragraph')}>
            <Text
              style={{
                color: radiovalue == 'key-paragraph' ? 'white' : 'black',
                fontWeight: 'bold',
              }}>
              Key paragraph
            </Text>
          </TouchableRipple>
          <View
            style={{
              height: '100%',
              borderWidth: 1,
              borderColor: 'grey',
              marginHorizontal: 2,
            }}
          />
          <TouchableRipple
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginTop: -10,
              marginBottom: -10,
              marginRight: -2,
              backgroundColor: radiovalue == 'table' ? 'black' : 'white',
            }}
            rippleColor={'white'}
            onPress={() => setradioValue('table')}>
            <Text
              style={{
                color: radiovalue == 'table' ? 'white' : 'black',
                fontWeight: 'bold',
              }}>
              Table
            </Text>
          </TouchableRipple>
        </View>
        {state.filtervalue?.length > 0 && radiovalue == 'key-value' && (
          <>
            <RenderTable data={state.filtervalue} />
          </>
        )}
        {state.loading ? (
          <ActivityIndicator
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            size={'large'}
          />
        ) : (
          (radiovalue == 'paragraph' || radiovalue == 'key-paragraph') && (
            <FlatList
              data={state.filtervalue}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          )
        )}
        {state.filtervalue?.length > 0 && radiovalue == 'table' && (
          <RenderTable2 data={state.filtervalue} />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 10,
    backgroundColor: '#3C12B3', //F0F4F7
  },
});
export default Home;
