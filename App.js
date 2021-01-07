/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image
} from 'react-native';
import {
  Container,
  Title,
  Left,
  Right,
  Body,
  Text,
  Header,
  Button,
  Form,
  Item,
  Input,
  Card,
  CardItem,
} from 'native-base';

import useAxios from 'axios-hooks'

import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: () => React$Node = () => {
  
  // load cities when app starts
  useEffect(() => {
    getData();
  },[]);  

  const [modalVisible, setModalVisible] = useState(false); 
  const [cityName, setCityName] = useState(""); 
  const [cities, setCities] = useState([]);
   

  const openDialog = () => {
    setModalVisible(true);
  }

  const addCity = () => {
    setCities( [...cities,{id:cities.length, name:cityName}]); 
    setModalVisible(false);
  }

  const cancelCity = () => {
    setModalVisible(false);
  }

  const deleteCity = (id) => {
    let filteredArray = cities.filter(city => city.id !== id);
    setCities(filteredArray);
  }

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(cities));
    } catch (e) {
      // saving error
      console.log("Cities saving error!");
    }
  }

  // save cities if cities state changes
  useEffect(() => {
    storeData();
  },[cities]); 

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities')
      if(value !== null) {
        setCities(JSON.parse(value));
      }
    } catch(e) {
      console.log("Cities loading error!");
    }
  }


  return (
    <Container>
      <Header>
        <Left/>
        <Body>
          <Title>Weather App</Title>
        </Body>
        <Right>
          <Button>
            <Text onPress={openDialog}>Add</Text>
          </Button>
        </Right>
      </Header>
      <ScrollView>
      {!modalVisible && cities.map(function(city,index){
        return (
          <WeatherForecast 
            key={index} 
            city={city.name} 
            id={city.id} 
            deleteCity={deleteCity} />
        )
      })}
      </ScrollView>
      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>Add a new city</Dialog.Title>
        <Form>
          <Item>
            <Input onChangeText={ (text) => setCityName(text)} placeholder="cityname"/>
          </Item>
        </Form>
        <Dialog.Button label="Cancel" onPress={cancelCity} />
        <Dialog.Button label="Add" onPress={addCity} />
      </Dialog.Container>
    </Container>
  );
};
export default App;

const WeatherForecast = (params) => {
  const city = params.city;
  const API_KEY = '5a71bd244351b7c802231cece2a46e25';
  const URL = 'https://api.openweathermap.org/data/2.5/weather?q=';

  const [{ data, loading, error }, refetch] = useAxios(
    URL+city+'&appid='+API_KEY+'&units=metric'
  )

  const refreshForecast = () => {
    refetch();
  }

  const deleteCity = () => {
    params.deleteCity(params.id);
  }

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error!</Text>;

  // just for testing
  // console.log(data);

  let iconPath = 'http://openweathermap.org/img/w/'
  let iconUrl = iconPath + data.weather[0].icon + '.png';

  return (
    <Card>
      <CardItem>
        <Body>
          <View style={styles.cityCard}>
            <View>
              <Image source={{uri: iconUrl}} style={{width: 99, height: 99}} />
            </View>
            <View>
              <Text style={styles.cityTitle}>{data.name} - {data.weather[0].description}</Text>
              <Text>Main: {data.weather[0].main}</Text>
              <Text>Temperature: {data.main.temp} °C</Text>
              <Text>Feels: {data.main.feels_like} °C</Text>
              <Text>Min-Max: {data.main.temp_min} °C - {data.main.temp_max} °C</Text>
            </View>
          </View>
          <View style={styles.cityCardAction}>
            <Text style={styles.cityRemove} onPress={deleteCity}>Remove</Text>
            <Text style={styles.cityRefresh} onPress={refreshForecast}>Refresh</Text>
          </View>
        </Body>
      </CardItem>
    </Card>
  );
}

const styles = StyleSheet.create({
  cityCard: {
    flex: 1,
    flexDirection: 'row',
  },
  cityTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cityCardAction: {
    flex: 1,
    flexDirection:'row',
    marginTop: 20,
    justifyContent: 'space-between'
  },
  cityRefresh: {
    fontSize: 14,
  },
  cityRemove: {
    fontSize: 14,
    paddingRight: 250,
  }
})
