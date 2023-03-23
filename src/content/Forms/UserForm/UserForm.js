import React, { useState, Component, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Column,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Form,
  Stack,
  TextInput,
  Button,
  FormGroup,
  RadioButton,
  RadioButtonGroup,
  ButtonSet,
  PasswordInput,
  Loading,
  TabPanel
} from '@carbon/react';
import { Save } from '@carbon/react/icons';

class UserForm extends Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    gender: 'radio-1',
    isLoading: false,
    toUpdate: false,
  };

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleRadioButtonChange = (value) => {
    this.setState({ gender: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { username, password, toUpdate } = this.state;
    const userID = this.getUserID();

    this.setState({ isLoading: true });

    try {
      if (toUpdate) {
        await this.updateUser(userID, username, password);
      } else {
        await this.createUser(username, password);
      }

      console.log('OK');
      window.location.href = '/users';
    } catch (error) {
      console.error(error);
      alert('Failed to save user. Please try again.');
      this.setState({ isLoading: false });
    }
  };

  async createUser(username, password) {
    await axios.post('/assetlift/user', { username, password });
  }

  async updateUser(userID, username, password) {
    await axios.put(`/assetlift/user/${userID}`, { username, password });
  }

  getUserID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('userid');
  }

  async componentDidMount() {
    const userID = this.getUserID();

    try {
      const response = await axios.get(`assetlift/user/${userID}`);
      const { username, password } = response.data;
      this.setState({ username, password, toUpdate: true });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { firstName, lastName, username, password, gender, isLoading } = this.state;

    return (
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <Tabs>
            <TabList aria-label="List of tabs">
              <Tab>New User</Tab>
              <Tab>Related Work</Tab>
              <Tab>Assets</Tab>
              <Tab>About</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup style={{ maxWidth: '500px' }}>
                    <Stack gap={7}>
                      <TextInput id="firstName" labelText="First Name" onChange={this.handleChange} value={firstName} />
                      <TextInput id="lastName" labelText="Last Name" onChange={this.handleChange} value={lastName} />
                      <TextInput id="username" labelText="Username" onChange={this.handleChange} value={username} />
                      <PasswordInput id="password" labelText="Password" onChange={this.handleChange} value={password} />
                      <RadioButtonGroup
                        legendText="Gender"
                        name="radio-button-group"
                        selectedValue={gender}
                        onChange={this.handleRadioButtonChange}
                      >
                        <RadioButton labelText="Masculine" value="radio-1" id="radio-1" />
                        <RadioButton labelText="Feminine" value="radio-2" id="radio-2" />
                        <RadioButton labelText="Neuter" value="radio-3" id="radio-3" />
                      </RadioButtonGroup>
                      <Button
                        type="submit"
                        renderIcon={Save}
                        iconDescription="Save"
                        disabled={isLoading}
                      >
                        Save
                      </Button>
                      {isLoading && <Loading />}
                    </Stack>
                  </FormGroup>
                </Form>
              </TabPanel>
              <TabPanel>In Progress1</TabPanel>
              <TabPanel>In Progress2</TabPanel>
              <TabPanel>In Progress3</TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>
    );
  }
}

export default UserForm;
