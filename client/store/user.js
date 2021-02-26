import axios from "axios";

const initialState = { name: "anonymous" };

const GOT_USER = "GOT_USER";

const gotUser = (user) => ({
  type: GOT_USER,
  user,
});

export const login = (body) => async (dispatch) => {
  try {
    const { data } = await axios.put("/auth/login", body);
    dispatch(gotUser(data));
  } catch (error) {
    console.error(error);
  }
};

export const me = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/auth/me");
    dispatch(gotUser(data || initialState));
  } catch (error) {
    console.error(error);
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GOT_USER:
      return action.user;
    default:
      return state;
  }
};
