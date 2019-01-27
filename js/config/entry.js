/**
 * Created by liaowm5 on 1/23/18.
 */

import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import HomePage from '../page/HomePage';
import BarPage from "../page/BarPage";
import NewBarPage from '../page/NewBarPage'
import NewPostPage from '../page/NewPostPage';
import NewCommentPage from '../page/NewCommentPage';
import PostPage from "../page/PostPage";
import ProfilePage from "../page/ProfilePage";
import SearchPage from "../page/SearchPage";
import SignInPage from "../page/auth/SignInPage"
import SignUpPage from "../page/auth/SignUpPage"

import MyFragment from "../page/MyFragment";

const MainNavigator  = createStackNavigator({
  HomePage: {screen: HomePage,navigationOptions: {header: null} },
  BarPage: {screen: BarPage},
  PostPage: {screen: PostPage},
  SearchPage:{screen: SearchPage,navigationOptions: {header: null} },
  SignInPage: {screen: SignInPage,navigationOptions: {header: null} },
  SignUpPage: {screen: SignUpPage,navigationOptions: {header: null} },
  MyFragment: {screen: MyFragment,navigationOptions: {header: null} },
  NewBarPage: {screen: NewBarPage},
  NewPostPage: {screen: NewPostPage},
  NewCommentPage: {screen: NewCommentPage},
  ProfilePage:{screen: ProfilePage}
},{
  initialRouteName: "HomePage",
  navigationOptions: {
      header: null,// Will hide header for all screens of current stack navigator,
      //headerLeft: <HeaderLeft /> ,// Component to be displayed in left side of header (Generally it can be Hamburger)
      //headerRight: <HeaderRight /> // Component to be displayed in right side of header
  }
});

const App = createAppContainer(MainNavigator);

export default App;