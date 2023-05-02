import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  Image
} from "react-native";

const BASED_URL =
  "https://app.wagesplitter-dev.com/api/retailer/details?page_size=200";

const App = () => {
  const [retailers, setRetailers] = useState([]);
  const [searchTextInput, setSearchTextInput] = useState("");
  const [Err, setErr] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getHeader = () => {
    const header = {
      "X-User-Identification-Id": "c914304f-5a3e-44e3-9add-0d03c931c6a3",
      "X-User-Auth-Token": "aJyuDUSkauNV3AIq0s8wEw"
    };
    return header;
  };

  const fetchGet = (url) => {
    const header = getHeader();
    return fetch(`${url}`, {
      headers: header,
      method: "GET"
    }).then(async (res) => {
      const data = await res.json();
      return data;
    });
  };

  useEffect(() => {
    fetchGet(BASED_URL)
      .then((res) => setRetailers(res.data.items))
      .catch((err) => setErr(err.message))
      .finally(setIsLoading(false));
  }, []);

  const Item = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeftContaier}>
        <Image
          source={{
            uri: `https://cards.wagesplitter-dev.com/api/Retailer/logo/${item.logoUri}`
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.itemRightContainer}>
        <Text>{`Earn ${item.rewardPercent}%`}</Text>
        <Text
          style={{ color: "grey" }}
        >{`On spend over $${item.rewardThreshold}`}</Text>
      </View>
    </View>
  );

  const filteredData = retailers.filter((item) =>
    item.name.toLowerCase().includes(searchTextInput.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={searchTextInput}
        onChangeText={setSearchTextInput}
        style={styles.input}
      />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
        containerStyle={styles.flatlist}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: "black",
    paddingVertical: 20
  },
  itemLeftContaier: { flex: 1 },
  itemRightContainer: {
    flex: 1,
    justifyItems: "center",
    alignItems: "flex-end"
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  title: {
    fontSize: 32
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  }
});

export default App;
