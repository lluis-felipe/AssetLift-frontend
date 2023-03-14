import React, { useState, Component } from 'react';
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
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      gender: 'radio-1',
      isLoading: false
    };
  }

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleRadioButtonChange = (value) => {
    this.setState({ gender: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.setState({ isLoading: true });
    axios
      .post('/assetlift/user', { username, password })
      .then((response) => {
        console.log(response);
        console.log('OK');
        window.location.href = '/users';
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false });
      });
  };

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
