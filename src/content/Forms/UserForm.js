import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Column,
  Form,
  Stack,
  TextInput,
  Button,
  FormGroup,
  PasswordInput,
  Loading,
  FormLabel,
  Theme,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Link,
} from '@carbon/react';
import { Save, Search } from '@carbon/react/icons';

function UserForm() {
  const [formData, setFormData] = useState({
    id: null,
    status: null,
    access: null,
    username: null,
    password: null,
    person: {
      id: null,
      firstname: null,
      lastname: null,
      email: null,
      phone: null,
    },
    isLoading: false,
    toUpdate: false,
  });

  const [personList, setPersonList] = useState([]);
  const [openPerson, setOpenPerson] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePersonClick = (person) => {
    setFormData((prevState) => ({
      ...prevState,
      person: {
        ...prevState.person,
        id: person.id,
        firstname: person.firstname,
        lastname: person.lastname,
        email: person.email,
        phone: person.phone,
      },
    }));
    setOpenPerson(false);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { status, access, username, password, person, toUpdate } = formData;
    const userID = getUserID();

    setFormData((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      if (toUpdate) {
        await updateUser(userID, status, access, username, password, person);
      } else {
        await createUser(status, access, username, password, person);
      }

      console.log('OK');
      window.location.href = '/users';
    } catch (error) {
      console.error(error);
      alert('Failed to save user. Please try again.');
      setFormData((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  const createUser = async (status, access, username, password, person) => {
    await axios.post('/assetlift/user', { status, access, username, password, person });
  };

  const updateUser = async (userID, status, access, username, password, person) => {
    await axios.put(`/assetlift/user/${userID}`, {
      status,
      access,
      username,
      password,
      person,
    });
  };

  const getUserID = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('userid');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userID = getUserID();

      try {
        const [userResponse, personResponse] = await Promise.all([
          axios.get(`/assetlift/user/${userID}`),
          axios.get(`/assetlift/person`),
        ]);

        const { id, status, access, username, password, person } = userResponse.data;

        const { id: personId, firstname, lastname, status: personStatus, email, phone, address, city, state, zip, country, department, supervisor } = person;

        const updatedPerson = {
          id: personId,
          firstname,
          lastname,
          status: personStatus,
          email,
          phone,
          address,
          city,
          state,
          zip,
          country,
          department,
          supervisor,
        };

        setFormData((prevState) => ({
          ...prevState,
          id,
          status,
          access,
          username,
          password,
          person: updatedPerson,
          toUpdate: true,
        }));

        setPersonList(personResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const { id, status, access, username, password, person, isLoading } = formData;

  return (
    <Theme theme="g10">
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Stack gap={10}>
                <div>
                  <Grid>
                    <Column lg={4} sm={4}>
                      <TextInput id="user" labelText="User" value={id} />
                    </Column>
                    <Column lg={4} sm={4}>
                      <TextInput id="status" labelText="Status" onChange={handleChange} value={status} />
                    </Column>
                    <Column lg={4} sm={4}>
                      <TextInput id="access" labelText="Access" onChange={handleChange} value={access} />
                    </Column>
                  </Grid>
                </div>

                <div>
                  <Stack gap={4}>
                    <FormLabel>Login Information</FormLabel>
                    <Grid>
                      <Column lg={4} sm={4}>
                        <TextInput id="username" labelText="Username" onChange={handleChange} value={username} />
                      </Column>
                      <Column lg={4} sm={4}>
                        <PasswordInput id="password" labelText="Password" onChange={handleChange} value={password} />
                      </Column>
                    </Grid>
                  </Stack>
                </div>

                <div>
                  <Stack gap={4}>
                    <FormLabel>Person Information</FormLabel>
                    <Grid>
                      <Column lg={4} sm={4}>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <TextInput
                            id="person"
                            labelText="Person"
                            onChange={handleChange}
                            value={person.id}
                          />
                          <Button
                            hasIconOnly
                            kind="ghost"
                            renderIcon={Search}
                            iconDescription="Search person"
                            style={{ borderBottom: '1px solid #909090' }}
                            onClick={() => setOpenPerson(true)}
                          />
                        </div>
                      </Column>
                      <Column lg={4} sm={4}>
                        <TextInput id="firstname" labelText="First Name" onChange={handleChange} value={person.firstname || ''} />
                      </Column>
                      <Column lg={4} sm={4}>
                        <TextInput id="lastname" labelText="Last Name" onChange={handleChange} value={person.lastname || ''} />
                      </Column>
                    </Grid>
                  </Stack>
                </div>

                <div>
                  <Stack gap={4}>
                    <FormLabel>Contact</FormLabel>
                    <Grid>
                      <Column lg={4} sm={4}>
                        <TextInput id="email" labelText="Email" onChange={handleChange} value={person.email || ''} />
                      </Column>
                      <Column lg={4} sm={4}>
                        <TextInput id="phone" labelText="Phone" onChange={handleChange} value={person.phone || ''} />
                      </Column>
                    </Grid>
                  </Stack>
                </div>

                <div>
                  <Grid>
                    <Column lg={2}>
                      <Button type="submit" renderIcon={Save} iconDescription="Save" disabled={isLoading}>
                        Save
                      </Button>
                    </Column>
                  </Grid>
                </div>
              </Stack>
            </FormGroup>
          </Form>
          {isLoading && <Loading />}
        </Column>
      </Grid>

      {/* Location Dialog */}
      <ComposedModal open={openPerson} onClose={() => setOpenPerson(false)}>
        <ModalHeader title="Person List" />
        <ModalBody>
          <StructuredListWrapper selection>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell>ID</StructuredListCell>
                <StructuredListCell>Person</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {personList.map((person) => (
                <StructuredListRow key={person.id}>
                  <StructuredListCell><Link onClick={() => handlePersonClick(person)}>{person.id}</Link></StructuredListCell>
                  <StructuredListCell><Link onClick={() => handlePersonClick(person)}>{person.person}</Link></StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </ModalBody>
        <ModalFooter primaryButtonText="OK" />
      </ComposedModal>
    </Theme>
  );
}

export default UserForm;