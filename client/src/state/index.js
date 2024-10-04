import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  tasks: [],
  expiredtasks: [],
  plateformUsers: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.tasks = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.log("User friends not exit");
      }
    },
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload.task);
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => task._id !== action.payload.taskId
      );
    },
    expiredTasks: (state, action) => {
      state.expiredtasks = action.payload.tasks;
    },
    setPlateFormUsers: (state, action) => {
      state.plateformUsers = action.payload.users;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setTasks,
  addTask,
  removeTask,
  expiredTasks,
  setPlateFormUsers,
} = authSlice.actions;

export default authSlice.reducer;
