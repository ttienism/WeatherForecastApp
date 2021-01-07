import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Dialog from "react-native-dialog";

export default class NewCityDialog extends React.Component {
  render() {
    return (
      <View>
        <Dialog.Container visible={true}>
          <Dialog.Title>Account delete</Dialog.Title>
          <Dialog.Description>
            Do you want to delete this account? You cannot undo this action.
          </Dialog.Description>
          <Dialog.Button label="Cancel" />
          <Dialog.Button label="Delete" />
        </Dialog.Container>
      </View>
    );
  }
}