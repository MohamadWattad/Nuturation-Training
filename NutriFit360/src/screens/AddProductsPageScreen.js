import React,{useState , useContext} from "react";
import {View , StyleSheet ,TextInput,Alert, Text,Button} from 'react-native';
import {  Context as AuthContext } from "../context/AuthContext";

const AddProductsPageScreen = () => {
    const {addproducts} = useContext(AuthContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const handleSubmit = () => {
        if (!name || !price) {
            Alert.alert("Error", "Name and Price are required!");
            return;
        }
        addproducts({ name, description, price, image, stock, category });
        setName("");
        setDescription("");
        setPrice("");
        setImage("");
        setStock("");
        setCategory("");
        Alert.alert("Success", "Product added successfully!");
    };

    return (
        <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
        />
        <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
        />
        <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={image}
            onChangeText={setImage}
        />
        <TextInput
            style={styles.input}
            placeholder="Stock"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
        />
        <Button title="Add Product" onPress={handleSubmit} />
    </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});



export default AddProductsPageScreen;