import React,{useState, useContext} from 'react';
import {StyleSheet , View , TextInput , Button , Alert} from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';

const AddVideoPageScreen =() => {
    const {AddVideo} = useContext(AuthContext);
    const [title , setTitle] = useState('');
    const [gifUrl , setgifUrl] = useState('');
    const [muscleGroup , setmuscleGroup] = useState('');
    const [description, setDescription] = useState('');
    const [duration , setDuration] = useState('');
    const handleSubmit = () => {
        if (!title || !gifUrl || !muscleGroup) {
            Alert.alert("Error", "title and gifUrl and muscleGroup are required!");
            return;
        }
        AddVideo({ title, gifUrl, muscleGroup, description, duration});
        setTitle("");
        setgifUrl("");
        setmuscleGroup("");
        setDescription("");
        setDuration("");
        Alert.alert("Success", "Video added successfully!");
    };
    return (
        <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Video Name"
            value={title}
            onChangeText={setTitle}
        />
        <TextInput
            style={styles.input}
            placeholder="Video"
            value={gifUrl}
            onChangeText={setgifUrl}
        />
        <TextInput
            style={styles.input}
            placeholder="muscleGroup"
            value={muscleGroup}
            onChangeText={setmuscleGroup}
        />
        <TextInput
            style={styles.input}
            placeholder="description"
            value={description}
            onChangeText={setDescription}
        />
        <TextInput
            style={styles.input}
            placeholder="duration"
            value={duration}
            onChangeText={setDuration}
        />
        <Button title="Add Video" onPress={handleSubmit} />
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


export default AddVideoPageScreen;