import React, { Component } from 'react';
import axios from 'axios';
import {
  Grid,
  Column,
  Form,
  Stack,
  TextInput,
  Button,
  FormGroup,
  Loading,
  FormLabel,
  Theme
} from '@carbon/react';
import { Save } from '@carbon/react/icons';

class PersonForm extends Component {
  state = {
    person: '',
    firstname: '',
    lastname: '',
    status: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    department: '',
    supervisor: '',
    isLoading: false,
    toUpdate: false,
  };

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate } = this.state;
    const personID = this.getPersonID();

    this.setState({ isLoading: true });

    try {
      if (toUpdate) {
        await this.updatePerson(personID, person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate)
      } else {
        await this.createPerson(person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate);
      }

      console.log('OK');
      window.location.href = '/person';
    } catch (error) {
      console.error(error);
      alert('Failed to save person. Please try again.');
      this.setState({ isLoading: false });
    }
  };

  async createPerson(person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate) {
    await axios.post('/assetlift/person', { person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate });
  }

  async updatePerson(personID, person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate) {
    await axios.put(`/assetlift/person/${personID}`, { person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate });
  }

  getPersonID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('personid');
  }

  async componentDidMount() {
    const personID = this.getPersonID();

    try {
      const response = await axios.get(`assetlift/person/${personID}`);
      const { id, person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading } = response.data;
      this.setState({ id, person, firstname, lastname, status, email, phone, address, city, state, zip, country, department, supervisor, isLoading, toUpdate: true });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { id, person, firstname, lastname, status, email, phone, address, city, state, country, department, supervisor, isLoading } = this.state;

    return (
      <Theme theme="g10">
        <Grid fullWidth>
          <Column lg={16} md={8} sm={4}>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Stack gap={10}>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Person Information</FormLabel>
                      <Grid>
                        <Column lg={1} sm={4}>
                          <TextInput id="id" labelText="Id" onChange={this.handleChange} value={id} />
                        </Column>
                        <Column lg={2} sm={4}>
                          <TextInput id="person" labelText="Person" onChange={this.handleChange} value={person} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="firstname" labelText="First Name" onChange={this.handleChange} value={firstname} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="lastname" labelText="Last Name" onChange={this.handleChange} value={lastname} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="status" labelText="Status" onChange={this.handleChange} value={status} />
                        </Column>
                      </Grid>
                    </Stack>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Contact Information</FormLabel>
                      <Grid>
                        <Column lg={4} sm={4}>
                          <TextInput id="email" labelText="Email" onChange={this.handleChange} value={email} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="phone" labelText="Phone" onChange={this.handleChange} value={phone} />
                        </Column>
                      </Grid>
                    </Stack>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Address Information</FormLabel>
                      <Grid>
                        <Column lg={4} sm={4}>
                          <TextInput id="address" labelText="Address" onChange={this.handleChange} value={address} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="city" labelText="City" onChange={this.handleChange} value={city} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="state" labelText="State" onChange={this.handleChange} value={state} />
                        </Column>
                        {/* <Column lg={4} sm={4}>
                          <TextInput id="zip" labelText="Zip" onChange={this.handleChange} value={zip} />
                        </Column> */}
                        <Column lg={4} sm={4}>
                          <TextInput id="country" labelText="Country" onChange={this.handleChange} value={country} />
                        </Column>
                      </Grid>
                    </Stack>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Management Information</FormLabel>
                      <Grid>
                        <Column lg={4} sm={4}>
                          <TextInput id="department" labelText="Department" onChange={this.handleChange} value={department} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="supervisor" labelText="Supervisor" onChange={this.handleChange} value={supervisor} />
                        </Column>
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

export default PersonForm;
