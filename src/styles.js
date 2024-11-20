import { StyleSheet } from "react-native-web";

export const styles = StyleSheet.create({
  // Styles de base
  container: {
    flex: 1,
    minHeight: "100vh",
    width: "100%",
    WebkitOverflowScrolling: "touch", // Ajoutez cette ligne pour iOS
    overflowY: "auto",
    // Dégradé multi-étapes pour éviter les teintes verdâtres
    backgroundImage:
      "linear-gradient(180deg, #87CEEB 0%, #B4E1FF 35%, #FFE5B4 70%, #FFD700 100%)",
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    height: "100%",
    overflowY: "scroll", // Ajouté
    WebkitOverflowScrolling: "touch", // Modifiez cette ligne
    //paddingBottom: 100, // Espace pour le défilement
  },
  adminContainer: {
    minHeight: 200, // Ajustez selon vos besoins
    marginBottom: 20,
    overflowY: "visible",
    width: "100%",
    //paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "500px",
    margin: "0 auto",
  },

  // [Le reste du code reste identique, seule la partie du dégradé change]

  // Styles des textes
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFF",
    textAlign: "center",
    textShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  },
  centeredHeader: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFF",
    width: "100%",
    textShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  },
  emptyText: {
    textAlign: "center",
    color: "#444",
    padding: 20,
  },

  // Styles des inputs
  input: {
    height: 40,
    width: "100%",
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    fontSize: 16,
    backdropFilter: "blur(5px)",
  },

  // Styles des cartes de cours
  classItem: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    backdropFilter: "blur(5px)",
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2C3E50",
  },
  classStatus: {
    color: "#4A90E2", // Changé pour un bleu plutôt que vert
    marginBottom: 10,
  },

  // Styles des modals
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(5px)",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2C3E50",
  },

  // Styles des utilisateurs
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 8,
    marginBottom: 10,
    backdropFilter: "blur(5px)",
  },

  // Styles des boutons et contrôles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#4A90E2", // Changé pour un bleu plutôt que vert
    marginLeft: 10,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
  },

  // Style du calendrier
  calendar: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backdropFilter: "blur(5px)",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  calendarNavButton: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    color: "#4A90E2", // Changé pour un bleu plutôt que vert
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  weekDay: {
    width: "14.28%",
    textAlign: "center",
    paddingVertical: 5,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  day: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDay: {
    width: "14.28%",
    aspectRatio: 1,
  },
  selectedDay: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
  },
  dayText: {
    textAlign: "center",
    color: "#2C3E50",
  },
  selectedDayText: {
    color: "#FFF",
  },
  // Styles responsifs
  "@media (max-width: 768px)": {
    mainContainer: {
      padding: 10,
    },
    modalContent: {
      width: "95%",
      padding: 15,
    },
    input: {
      fontSize: 14,
    },
  },
});
