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
    Theme,
    DatePicker,
    DatePickerInput,
    Select,
    SelectItem
} from '@carbon/react';
import { Save, Bee } from '@carbon/react/icons';

class AssetForm extends Component {
    state = {
        type: null,
        status: null,
        model: null,
        acquisitiondate: null,
        disposaldate: null,
        location: null,
        responsable: null,
        manufacturer: null,
        maintenanceschedule: null,
        usefullife: null,
        isLoading: false,
        toUpdate: false,
    };

    handleChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    handleAcquisitionDateChange = (event) => {
        console.log(event.target);
        const { value } = event.target;
        console.log(value)
        this.setState({ acquisitiondate: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, toUpdate } = this.state;
        const assetID = this.getAssetID();

        this.setState({ isLoading: true });

        try {
            if (toUpdate) {
                await this.updateAsset(assetID, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife);
                console.log(assetID);
            } else {
                await this.createAsset(type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife);
            }

            console.log('OK');
            window.location.href = '/asset';
        } catch (error) {
            console.error(error);
            alert('Failed to save asset. Please try again.');
            this.setState({ isLoading: false });
        }
    };

    async createAsset(type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife) {
        await axios.post('/assetlift/asset', { type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife });
    }

    async updateAsset(assetID, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife) {
        await axios.put(`/assetlift/asset/${assetID}`, { type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife });
    }

    getAssetID() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('assetid');
    }

    async componentDidMount() {
        const assetID = this.getAssetID();

        try {
            const response = await axios.get(`assetlift/asset/${assetID}`);
            const { id, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife } = response.data;
            this.setState({ id, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, toUpdate: true });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { id, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, isLoading } = this.state;
        // const { acquisitiondate, disposaldate } = this.state;

        return (
            <Theme theme="g10">
                <Grid fullWidth>
                    <Column lg={16} md={8} sm={4}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup legendText="">
                                <Stack gap={10}>
                                    <div>
                                        <Grid>
                                            <Column lg={4} sm={4}>
                                                <TextInput id="asset" labelText="Asset" value={id} />
                                            </Column>
                                            <Column lg={4} sm={4}>
                                                <TextInput id="type" labelText="Type" onChange={this.handleChange} value={type} />
                                            </Column>
                                            <Column lg={4} sm={4}>
                                                <Select
                                                    id="status"
                                                    defaultValue="Draft"
                                                    labelText="Status"
                                                    onChange={this.handleChange}
                                                    value={status}>
                                                    <SelectItem value="Draft" text="Draft" />
                                                    <SelectItem value="Active" text="Active" />
                                                    <SelectItem value="In repair" text="In repair" />
                                                    <SelectItem value="In storage" text="In storage" />
                                                    <SelectItem value="In storage" text="In storage" />
                                                    <SelectItem value="Disposed" text="Disposed" />
                                                </Select>

                                            </Column>
                                        </Grid>
                                    </div>

                                    <div>
                                        <Stack gap={4}>
                                            <FormLabel>Asset Information</FormLabel>
                                            <Grid>
                                                <Column lg={4} sm={4}>
                                                    <TextInput id="model" labelText="Model" onChange={this.handleChange} value={model} />
                                                </Column>
                                                <Column lg={4} sm={4}>
                                                    <TextInput id="location" labelText="Location" onChange={this.handleChange} value={location} />
                                                </Column>
                                                <Column lg={4} sm={4}>
                                                    <TextInput id="manufacturer" labelText="Manufacturer" onChange={this.handleChange} value={manufacturer} />
                                                </Column>
                                                <Column lg={4} sm={4}>
                                                    <TextInput id="responsable" labelText="Responsable" onChange={this.handleChange} value={responsable} />
                                                </Column>
                                            </Grid>
                                        </Stack>
                                    </div>

                                    <div>
                                        <Stack gap={1}>
                                            <Stack gap={4}>
                                                <FormLabel>Manufacturer Information</FormLabel>
                                                <Grid>
                                                    <Column lg={4} sm={4}>
                                                        <DatePicker datePickerType="single" value={acquisitiondate}>
                                                            <DatePickerInput
                                                                id="acquisitiondate"
                                                                labelText="Acquisition Date"
                                                                placeholder="mm/dd/yyyy"
                                                                onChange={this.handleAcquisitionDateChange}
                                                            // pattern="\d{1,2}\/\m{1,2}\/\y{4}"
                                                            />
                                                        </DatePicker>
                                                    </Column>

                                                    {/* <Column lg={4} sm={4}>
                                                    <DatePicker datePickerType="single" onChange={this.handleDatePickerChange}>
                                                        <DatePickerInput
                                                            placeholder="dd/mm/yyyy"
                                                            labelText="Disposal Date"
                                                            id="acquisitiondate"
                                                            value={disposaldate}
                                                        />
                                                        </DatePicker>
                                                    </Column> */}

                                                </Grid>
                                            </Stack>
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

export default AssetForm;
