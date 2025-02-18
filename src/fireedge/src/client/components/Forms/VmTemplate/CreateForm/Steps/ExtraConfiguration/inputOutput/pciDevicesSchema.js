/* ------------------------------------------------------------------------- *
 * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { string, array, object, ObjectSchema, ArraySchema } from 'yup'

import { useHost } from 'client/features/One'
import { getPciDevices } from 'client/models/Host'
import { Field, arrayToOptions, filterFieldsByHypervisor, getValidationFromFields } from 'client/utils'
import { T, INPUT_TYPES, HYPERVISORS } from 'client/constants'

const { vcenter, lxc, firecracker } = HYPERVISORS

const transformPciToString = (pciDevice = {}) => {
  const { DEVICE = '', VENDOR = '', CLASS = '' } = pciDevice
  return [DEVICE, VENDOR, CLASS].join(',')
}

const getPciAttributes = (pciDevice = '') => {
  const [DEVICE, VENDOR, CLASS] = pciDevice.split(',')
  return { DEVICE, VENDOR, CLASS }
}

/** @type {Field} Name PCI device field */
const DEVICE_NAME = {
  name: 'DEVICE_NAME',
  label: T.DeviceName,
  notOnHypervisors: [vcenter, lxc, firecracker],
  type: INPUT_TYPES.SELECT,
  values: () => {
    const hosts = useHost()
    const pciDevices = hosts.map(getPciDevices).flat()

    return arrayToOptions(pciDevices, {
      getText: ({ DEVICE_NAME } = {}) => DEVICE_NAME,
      getValue: transformPciToString
    })
  },
  validation: string().trim().notRequired(),
  grid: { sm: 12, md: 3 }
}

/** @type {Field} Common field properties */
const commonFieldProps = name => ({
  name,
  notOnHypervisors: [vcenter, lxc, firecracker],
  type: INPUT_TYPES.TEXT,
  dependOf: DEVICE_NAME.name,
  watcher: pciDevice => {
    if (pciDevice) {
      const { [name]: attribute } = getPciAttributes(pciDevice)

      return attribute
    }
  },
  validation: string().trim().required(),
  fieldProps: { disabled: true },
  grid: { xs: 12, sm: 4, md: 3 }
})

/** @type {Field} PCI device field */
const DEVICE = { label: T.Device, ...commonFieldProps('DEVICE') }

/** @type {Field} PCI device field */
const VENDOR = { label: T.Vendor, ...commonFieldProps('VENDOR') }

/** @type {Field} PCI device field */
const CLASS = { label: T.Class, ...commonFieldProps('CLASS') }

/**
 * @param {string} [hypervisor] - VM hypervisor
 * @returns {Field[]} List of Graphic inputs fields
 */
export const PCI_FIELDS = (hypervisor) =>
  filterFieldsByHypervisor([DEVICE_NAME, DEVICE, VENDOR, CLASS], hypervisor)

/** @type {ObjectSchema} PCI devices object schema */
export const PCI_SCHEMA = object(getValidationFromFields([DEVICE, VENDOR, CLASS]))

/** @type {ArraySchema} PCI devices schema */
export const PCI_DEVICES_SCHEMA = array(PCI_SCHEMA).ensure()
