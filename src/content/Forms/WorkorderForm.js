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
  DatePicker,
  DatePickerInput,
  ComboBox
} from '@carbon/react';
import { Save, Search } from '@carbon/react/icons';

function WorkorderForm() {
  const [formData, setFormData] = useState({
    id: null,
    description: null,
    status: null,
    asset: {
      id: null,
      status: null,
      type: null,
      model: null,
    },
    createddate: new Date().toLocaleDateString('en-GB'),
    duedate: new Date().toLocaleDateString('en-GB'),
    worktype: null,
    estimatedcosts: null,
    assignedto: null,
    toUpdate: false,
  });

  const [assetList, setAssetList] = useState([]);
  const [openAsset, setOpenAsset] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleAssetClick = (asset) => {
    setFormData((prevState) => ({
      ...prevState,
      asset: {
        ...prevState.asset,
        id: asset.id,
      },
    }));
    setOpenAsset(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const { description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto, toUpdate } = formData;
    const workorderID = getWorkorderID();

    setFormData((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      if (toUpdate) {
        await updateWorkorder(workorderID, description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto);
      } else {
        await createUser(description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto);
      }

      console.log('OK');
      window.location.href = '/workorder';
    } catch (error) {
      console.error(error);
      alert('Failed to save workorder. Please try again.');
      setFormData((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  const createUser = async (description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto) => {
    await axios.post('/assetlift/workorder', { description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto });
  };

  const updateWorkorder = async (workorderID, description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto) => {
    await axios.put(`/assetlift/workorder/${workorderID}`, {
      description,
      status,
      asset,
      createddate,
      duedate,
      worktype,
      estimatedcosts,
      assignedto
    });
  };

  const getWorkorderID = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('workorderid');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const workorderID = getWorkorderID();

      try {
        const [workorderResponse, assetResponse] = await Promise.all([
          axios.get(`/assetlift/workorder/${workorderID}`),
          axios.get(`/assetlift/asset`),
        ]);

        const { id, description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto } = workorderResponse.data;

        const { id: assetId, status: assetStatus, type, model } = asset;

        const updatedAsset = {
          id: assetId,
          status: assetStatus,
          type,
          model,
        };

        setFormData((prevState) => ({
          ...prevState,
          id, description, status, createddate, duedate, worktype, estimatedcosts, assignedto, toUpdate: true, asset: updatedAsset,
        }));

        setAssetList(assetResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const { id, description, status, asset, createddate, duedate, worktype, estimatedcosts, assignedto, isLoading } = formData;

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
                      <ComboBox
                        id="status"
                        titleText="Status"
                        onChange={(value) => {
                          setFormData((prevState) => ({
                            ...prevState,
                            status: value.selectedItem ,
                          }));
                        }}
                        value={status}
                        items={["Draft", "Active", "Open", "Closed", "Cancelled"]}
                      />
                    </Column>
                    <Column lg={4} sm={4}>
                      <TextInput id="description" labelText="description" onChange={handleChange} value={description} />
                    </Column>
                  </Grid>
                </div>

                <div>
                  <Stack gap={4}>
                    <FormLabel>Base Information</FormLabel>
                    <Grid>
                      <Column lg={4} sm={4}>
                        {/* <TextInput id="associatedasset" labelText="Associated Asset" onChange={handleChange} value={associatedasset} /> */}
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <TextInput
                            id="associatedasset"
                            labelText="Associated Asset"
                            onChange={handleChange}
                            value={asset.id}
                          />
                          <Button
                            hasIconOnly
                            kind="ghost"
                            renderIcon={Search}
                            iconDescription="Search person"
                            style={{ borderBottom: '1px solid #909090' }}
                            onClick={() => setOpenAsset(true)}
                          />
                        </div>
                      </Column>
                      <Column lg={4} sm={4}>
                        <DatePicker
                          datePickerType="single"
                          dateFormat="d/m/y"
                          onChange={(value) => {
                            const date = new Date(value);
                            const day = date.getDate();
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();
                            const formattedDate = `${day}/${month}/${year}`;
                            setFormData((prevState) => ({
                              ...prevState,
                              createddate: formattedDate,
                            }));
                          }}
                        >
                          <DatePickerInput
                            id="createddate"
                            labelText="Created Date"
                            placeholder="dd/mm/yyyy"
                            value={createddate}
                          />
                        </DatePicker>
                      </Column>

                      <Column lg={4} sm={4}>
                        <DatePicker
                          datePickerType="single"
                          dateFormat="d/m/y"
                          onChange={(value) => {
                            const date = new Date(value);
                            const day = date.getDate();
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();
                            const formattedDate = `${day}/${month}/${year}`;
                            setFormData((prevState) => ({
                              ...prevState,
                              duedate: formattedDate,
                            }));
                          }}
                        >
                          <DatePickerInput
                            id="duedate"
                            labelText="Due Date"
                            placeholder="dd/mm/yyyy"
                            value={duedate}
                          />
                        </DatePicker>
                      </Column>
                    </Grid>
                  </Stack>
                </div>

                <div>
                  <Stack gap={4}>
                    <FormLabel>Base Information</FormLabel>
                    <Grid>
                      <Column lg={4} sm={4}>
                        <TextInput id="worktype" labelText="Work Type" onChange={handleChange} value={worktype} />
                      </Column>
                      <Column lg={4} sm={4}>
                        <TextInput id="estimatedcosts" labelText="Estimated Costs" onChange={handleChange} value={estimatedcosts} />
                      </Column>
                      <Column lg={4} sm={4}>
                        <TextInput id="assignedto" labelText="Assigned to" onChange={handleChange} value={assignedto} />
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

      <ComposedModal open={openAsset} onClose={() => setOpenAsset(false)}>
        <ModalHeader title="Asset List" />
        <ModalBody>
          <StructuredListWrapper selection>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell>ID</StructuredListCell>
                <StructuredListCell>Asset</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {assetList.map((asset) => (
                <StructuredListRow key={asset.id}>
                  <StructuredListCell><Link onClick={() => handleAssetClick(asset)}>{asset.id}</Link></StructuredListCell>
                  <StructuredListCell><Link onClick={() => handleAssetClick(asset)}>{asset.model}</Link></StructuredListCell>
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

export default WorkorderForm;