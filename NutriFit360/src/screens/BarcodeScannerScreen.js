import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const QRScanner = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const getNutrient = (keys, unit = "") => {
    for (let key of keys) {
      const value = product.nutriments?.[key];
      if (value && !isNaN(value)) return `${value} ${unit}`;
    }
    return "N/A";
  };

  const handleScan = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
        const result = await response.json();
        if (result.status === 1) {
          setProduct(result.product);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        } else {
          Alert.alert("Product Not Found", "No product information available.");
          setScanned(false);
        }
      } catch (err) {
        Alert.alert("Error", "Failed to fetch product info.");
        setScanned(false);
      }
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setProduct(null);
    fadeAnim.setValue(0);
  };

  return (
    <View style={styles.container}>
      {!scanned && (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128"],
          }}
          onBarcodeScanned={handleScan}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setFacing((prev) => (prev === "back" ? "front" : "back"))}>
              <Text style={styles.buttonText}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {product && (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <ScrollView>
            <Text style={styles.productTitle}>{product.product_name || "Product Name Not Found"}</Text>

            {product.image_front_url ? (
              <Image source={{ uri: product.image_front_url }} style={styles.productImage} resizeMode="contain" />
            ) : (
              <Text style={styles.nutrient}>No image available</Text>
            )}

            <Text style={styles.nutrient}>Brand: {product.brands || "N/A"}</Text>
            <Text style={styles.nutrient}>Calories: {getNutrient(['energy-kcal', 'energy-kcal_100g', 'energy'], 'kcal')}</Text>
            <Text style={styles.nutrient}>Protein: {getNutrient(['proteins', 'proteins_100g'], 'g')}</Text>
            <Text style={styles.nutrient}>Sugar: {getNutrient(['sugars', 'sugars_100g'], 'g')}</Text>
            <Text style={styles.nutrient}>Fat: {getNutrient(['fat', 'fat_100g'], 'g')}</Text>
            <Text style={styles.nutrient}>Salt: {getNutrient(['salt', 'salt_100g'], 'g')}</Text>

            <TouchableOpacity style={styles.closeButton} onPress={resetScanner}>
              <Text style={styles.closeButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  message: { textAlign: "center", marginTop: 20 },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  productImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  nutrient: {
    fontSize: 16,
    marginVertical: 4,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default QRScanner;
