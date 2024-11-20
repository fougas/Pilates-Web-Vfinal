import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  Alert,
  ScrollView,
} from "react-native-web";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { styles } from "./styles";
import { BrowserRouter } from "react-router-dom";
import InstallBanner from "./components/InstallBanner";
// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCI7Ajf_9i7LRXeEOxxtNnF5S-x88KgvDw",
  authDomain: "pilates-ee95b.firebaseapp.com",
  projectId: "pilates-ee95b",
  storageBucket: "pilates-ee95b.appspot.com",
  messagingSenderId: "406434228854",
  appId: "1:406434228854:web:d7eace586a578698accd57",
  measurementId: "G-53NS286B1Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Composant Calendar personnalisé
const Calendar = ({ onDayPress, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const formatDateString = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toISOString().split("T")[0];
  };

  return (
    <View style={styles.calendar}>
      <View style={styles.calendarHeader}>
        <Button
          title="<"
          onPress={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
            )
          }
        />
        <Text style={styles.calendarTitle}>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Button
          title=">"
          onPress={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
            )
          }
        />
      </View>

      <View style={styles.calendarGrid}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}

        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyDay} />
          ))}

        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.day,
              selectedDate === formatDateString(day) && styles.selectedDay,
            ]}
            onPress={() => onDayPress({ dateString: formatDateString(day) })}
          >
            <Text
              style={[
                styles.dayText,
                selectedDate === formatDateString(day) &&
                  styles.selectedDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default function App() {
  // États
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [classes, setClasses] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    isAdmin: false,
  });
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    time: "",
    duration: "",
    capacity: "",
  });

  // useEffect pour l'initialisation
  useEffect(() => {
    const initializeData = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        if (snapshot.empty) {
          await addDoc(usersRef, {
            username: "admin",
            password: "admin123",
            isAdmin: true,
          });

          await addDoc(usersRef, {
            username: "user",
            password: "password",
            isAdmin: false,
          });

          const newSnapshot = await getDocs(usersRef);
          const usersList = newSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
        } else {
          const usersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
        }

        if (selectedDate) {
          await loadClasses(selectedDate);
        }
      } catch (error) {
        console.error("Erreur d'initialisation:", error);
        Alert.alert("Erreur", "Erreur lors de l'initialisation");
      }
    };

    initializeData();
  }, [selectedDate]);

  // Fonctions de gestion
  const handleLogin = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const user = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((u) => u.username === username && u.password === password);

      if (user) {
        setIsLoggedIn(true);
        setIsAdmin(user.isAdmin);
        setCurrentUser(user);
      } else {
        Alert.alert("Erreur", "Identifiants incorrects");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur de connexion");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setUsername("");
    setPassword("");
  };

  const loadClasses = async (date) => {
    try {
      const classesRef = collection(db, "classes");
      const snapshot = await getDocs(classesRef);
      const classesData = {};
      snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .forEach((classItem) => {
          if (classItem.date === date) {
            if (!classesData[date]) {
              classesData[date] = [];
            }
            classesData[date].push(classItem);
          }
        });
      setClasses(classesData);
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors du chargement des cours");
    }
  };
  // Fonctions de gestion des cours et utilisateurs
  const addUser = async () => {
    try {
      const usersRef = collection(db, "users");
      await addDoc(usersRef, newUser);
      setNewUser({ username: "", password: "", isAdmin: false });
      setShowUserModal(false);
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de l'ajout de l'utilisateur");
    }
  };

  const deleteUser = async (id) => {
    try {
      const userRef = doc(db, "users", id);
      await deleteDoc(userRef);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la suppression de l'utilisateur");
    }
  };

  const addClass = async () => {
    try {
      const classesRef = collection(db, "classes");
      const newClassItem = {
        ...newClass,
        date: selectedDate,
        enrolled: [],
        status: "Disponible",
        capacity: parseInt(newClass.capacity),
      };
      await addDoc(classesRef, newClassItem);
      await loadClasses(selectedDate);
      setNewClass({ name: "", time: "", duration: "", capacity: "" });
      setShowClassModal(false);
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de l'ajout du cours");
    }
  };

  const handleReservation = async (classItem) => {
    try {
      if (classItem.enrolled.includes(currentUser.id)) {
        Alert.alert("Erreur", "Vous êtes déjà inscrit à ce cours");
        return;
      }

      if (classItem.enrolled.length >= classItem.capacity) {
        Alert.alert("Erreur", "Ce cours est complet");
        return;
      }

      const classRef = doc(db, "classes", classItem.id);
      const updatedEnrolled = [...classItem.enrolled, currentUser.id];

      await updateDoc(classRef, {
        enrolled: updatedEnrolled,
        status:
          classItem.enrolled.length + 1 >= classItem.capacity
            ? "Complet"
            : "Disponible",
      });

      await loadClasses(selectedDate);
      Alert.alert("Succès", "Réservation effectuée");
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la réservation");
    }
  };

  const deleteClass = async (classId) => {
    try {
      const classRef = doc(db, "classes", classId);
      await deleteDoc(classRef);
      await loadClasses(selectedDate);
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la suppression du cours");
    }
  };

  // Composant pour rendre un cours
  const renderClass = ({ item }) => (
    <View style={styles.classItem}>
      <Text style={styles.className}>{item.name}</Text>
      <Text>
        {item.time} - {item.duration}
      </Text>
      <Text>
        Places: {item.enrolled.length}/{item.capacity}
      </Text>
      <Text
        style={[
          styles.classStatus,
          { color: item.status === "Complet" ? "red" : "green" },
        ]}
      >
        {item.status}
      </Text>
      {isAdmin ? (
        <View style={styles.buttonContainer}>
          <Button
            title="Voir inscrits"
            onPress={() => {
              setSelectedClass(item);
              setShowEnrolledModal(true);
            }}
          />
          <Button
            title="Supprimer"
            onPress={() => deleteClass(item.id)}
            color="red"
          />
        </View>
      ) : (
        <Button
          title="Réserver"
          onPress={() => handleReservation(item)}
          disabled={item.status === "Complet"}
        />
      )}
    </View>
  );
  // Rendu principal
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Connexion</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Se connecter" onPress={handleLogin} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.centeredHeader}>
          {isAdmin ? "Panneau d'administration" : "Cours de Pilates"}
        </Text>

        {isAdmin && (
          <View>
            <Button
              title="Ajouter un utilisateur"
              onPress={() => setShowUserModal(true)}
            />
            <FlatList
              data={users}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <Text>
                    {item.username} - {item.isAdmin ? "Admin" : "User"}
                  </Text>
                  <Button
                    title="Supprimer"
                    onPress={() => deleteUser(item.id)}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            loadClasses(day.dateString);
          }}
          selectedDate={selectedDate}
        />

        {isAdmin && (
          <Button
            title="Ajouter un cours"
            onPress={() => setShowClassModal(true)}
          />
        )}

        <FlatList
          data={classes[selectedDate] || []}
          renderItem={renderClass}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucun cours disponible pour cette date
            </Text>
          }
        />

        <Button title="Se déconnecter" onPress={handleLogout} />

        {/* Modal pour ajouter un utilisateur */}
        <Modal visible={showUserModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajouter un utilisateur</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={newUser.username}
                onChangeText={(text) =>
                  setNewUser({ ...newUser, username: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={newUser.password}
                onChangeText={(text) =>
                  setNewUser({ ...newUser, password: text })
                }
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setNewUser({ ...newUser, isAdmin: !newUser.isAdmin })
                }
              >
                <Text>Admin</Text>
                <View
                  style={[styles.checkbox, newUser.isAdmin && styles.checked]}
                />
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <Button title="Ajouter" onPress={addUser} />
                <Button
                  title="Annuler"
                  onPress={() => setShowUserModal(false)}
                  color="red"
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal pour ajouter un cours */}
        <Modal visible={showClassModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajouter un cours</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom du cours"
                value={newClass.name}
                onChangeText={(text) =>
                  setNewClass({ ...newClass, name: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Heure (ex: 10:00)"
                value={newClass.time}
                onChangeText={(text) =>
                  setNewClass({ ...newClass, time: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Durée (ex: 60 min)"
                value={newClass.duration}
                onChangeText={(text) =>
                  setNewClass({ ...newClass, duration: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Capacité"
                value={newClass.capacity}
                onChangeText={(text) =>
                  setNewClass({ ...newClass, capacity: text })
                }
                keyboardType="numeric"
              />
              <View style={styles.buttonContainer}>
                <Button title="Ajouter" onPress={addClass} />
                <Button
                  title="Annuler"
                  onPress={() => setShowClassModal(false)}
                  color="red"
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal pour voir les inscrits */}
        <Modal visible={showEnrolledModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Inscrits au cours {selectedClass?.name}
              </Text>
              <FlatList
                data={
                  selectedClass
                    ? users.filter((u) => selectedClass.enrolled.includes(u.id))
                    : []
                }
                renderItem={({ item }) => <Text>{item.username}</Text>}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Aucun inscrit</Text>
                }
              />
              <Button
                title="Fermer"
                onPress={() => setShowEnrolledModal(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
