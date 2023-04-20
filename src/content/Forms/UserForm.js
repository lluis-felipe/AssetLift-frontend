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
  TabPanel,
  FormLabel,
  Theme
} from '@carbon/react';
import { Save, Bee } from '@carbon/react/icons';

class UserForm extends Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    isLoading: false,
    toUpdate: false,
  };

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { status, access, username, password, toUpdate } = this.state;
    const userID = this.getUserID();

    this.setState({ isLoading: true });

    try {
      if (toUpdate) {
        await this.updateUser(userID, status, access, username, password);
      } else {
        await this.createUser(status, access, username, password);
      }

      console.log('OK');
      window.location.href = '/users';
    } catch (error) {
      console.error(error);
      alert('Failed to save user. Please try again.');
      this.setState({ isLoading: false });
    }
  };

  async createUser(status, access, username, password) {
    await axios.post('/assetlift/user', { status, access, username, password });
  }

  async updateUser(userID, status, access, username, password) {
    await axios.put(`/assetlift/user/${userID}`, { status, access, username, password });
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
      const { id, status, access, username, password } = response.data;
      this.setState({ id, status, access, username, password, toUpdate: true });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { id, status, access, username, password, isLoading } = this.state;

    return (
      <Theme theme="g10">
        <Grid fullWidth>
          <Column lg={16} md={8} sm={4}>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Stack gap={10}>
                  <div>
                    <Grid>
                      <Column lg={4} sm={4}>
                        <TextInput id="user" labelText="User" value={id} />
                      </Column>
                      <Column lg={4} sm={4}>
                        <TextInput id="status" labelText="Status" onChange={this.handleChange} value={status} />
                      </Column>
                      <Column lg={4} sm={4}>
                        <TextInput id="access" labelText="Access" onChange={this.handleChange} value={access} />
                      </Column>
                    </Grid>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Login Information</FormLabel>
                      <Grid>
                        <Column lg={4} sm={4}>
                          <TextInput id="username" labelText="Username" onChange={this.handleChange} value={username} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <PasswordInput id="password" labelText="Password" onChange={this.handleChange} value={password} />
                        </Column>
                        {/* <Column lg={4} sm={4}>
                      <TextInput id="Test" labelText="Test" />
                    </Column>
                    <Column lg={4} sm={4}>
                      <TextInput id="Test" labelText="Test" />
                    </Column> */}
                      </Grid>
                    </Stack>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Person Information</FormLabel>
                      <Grid>
                        <Column lg={4} sm={4}>
                          <Stack gap={6}>
                            <TextInput id="person" labelText="Person" />
                            <TextInput id="status" labelText="Status" />
                            <TextInput id="department" labelText="Department" />
                            <TextInput id="supervisor" labelText="Supervisor" />
                          </Stack>
                        </Column>
                        <Column lg={4} sm={4}>
                          <Stack gap={6}>
                            <TextInput id="firstName" labelText="First Name" />
                            <TextInput id="lastName" labelText="Last Name" />
                            <TextInput id="email" labelText="Email" />
                            <TextInput id="phone" labelText="Phone" />
                          </Stack>
                        </Column>
                        <Column lg={4} sm={4}>
                          <Stack gap={6}>
                            <TextInput id="adress" labelText="Adress" />
                            <TextInput id="city" labelText="City" />
                            <TextInput id="state" labelText="State" />
                            {/* <TextInput id="zip" labelText="Zip" /> */}
                            <TextInput id="country" labelText="Country" />
                          </Stack>
                        </Column>
                        {/* <Column lg={4} sm={4}>
                      <TextInput id="Test" labelText="Test" />
                    </Column> */}
                      </Grid>
                    </Stack>
                  </div>
                  <Button
                    type="submit"
                    renderIcon={Save}
                    iconDescription="Save"
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                </Stack>

              </FormGroup>
            </Form>
            {isLoading && <Loading />}
          </Column>
        </Grid>
      </Theme>

    );
  }
}

export default UserForm;
