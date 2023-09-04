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

class LocationForm extends Component {
  state = {
    locationName: '',
    address: '',
    city: '',
    stateProvince: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    phoneNumber: '',
    emailAddress: '',
    description: '',
    isLoading: false,
    toUpdate: false,
  };

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description, toUpdate } = this.state;
    const locationID = this.getLocationID();

    this.setState({ isLoading: true });

    try {
      if (toUpdate) {
        await this.updateLocation(locationID, locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description);
      } else {
        await this.createLocation(locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description);
      }

      console.log('OK');
      window.location.href = '/location';
    } catch (error) {
      console.error(error);
      alert('Failed to save location. Please try again.');
      this.setState({ isLoading: false });
    }
  };

  async createLocation(locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description) {
    await axios.post('/assetlift/location', { locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description });
  }

  async updateLocation(locationID, locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description) {
    await axios.put(`/assetlift/location/${locationID}`, { locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description });
  }

  getLocationID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('locationid');
  }

  async componentDidMount() {
    const locationID = this.getLocationID();

    try {
      const response = await axios.get(`assetlift/location/${locationID}`);
      const { id, locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description } = response.data;
      this.setState({ id, locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description, toUpdate: true });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { id, locationName, address, city, stateProvince, country, postalCode, latitude, longitude, phoneNumber, emailAddress, description, isLoading } = this.state;

    return (
      <Theme theme="g10">
        <Grid fullWidth>
          <Column lg={16} md={8} sm={4}>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Stack gap={10}>

                  <div>
                    <Grid>
                      <Column lg={2} sm={4}>
                        <TextInput id="location" labelText="Location" readOnly value={id} />
                      </Column>
                      <Column lg={3} sm={4}>
                        <TextInput id="locationName" labelText="Name" onChange={this.handleChange} value={locationName} />
                      </Column>
                      <Column lg={6} sm={4}>
                        <TextInput id="description" labelText="Description" onChange={this.handleChange} value={description} />
                      </Column>
                    </Grid>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Location Information</FormLabel>
                      <Grid>
                        <Column lg={6} sm={4}>
                          <TextInput id="address" labelText="Address" onChange={this.handleChange} value={address} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="postalCode" labelText="Postal Code" onChange={this.handleChange} value={postalCode} />
                        </Column>
                      </Grid>
                    </Stack>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Contact Information</FormLabel>
                      <Grid>
                        <Column lg={5} sm={4}>
                          <TextInput id="emailAddress" labelText="Email" onChange={this.handleChange} value={emailAddress} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="phoneNumber" labelText="Phone Number" onChange={this.handleChange} value={phoneNumber} />
                        </Column>
                      </Grid>
                    </Stack>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <Grid>
                        <Column lg={4} sm={4}>
                          <TextInput id="stateProvince" labelText="State/Province" onChange={this.handleChange} value={stateProvince} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="city" labelText="City" onChange={this.handleChange} value={city} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="country" labelText="Country" onChange={this.handleChange} value={country} />
                        </Column>
                      </Grid>
                    </Stack>
                  </div>

                  <div>
                    <Stack gap={4}>
                      <FormLabel>Coordinates</FormLabel>
                      <Grid>
                        <Column lg={4} sm={4}>
                          <TextInput id="latitude" labelText="Latitude" onChange={this.handleChange} value={latitude} />
                        </Column>
                        <Column lg={4} sm={4}>
                          <TextInput id="city" labelText="longitude" onChange={this.handleChange} value={longitude} />
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

export default LocationForm;
