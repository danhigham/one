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
/* eslint-disable jsdoc/require-jsdoc */
import { SetStateAction } from 'react'
import PropTypes from 'prop-types'
import { useWatch } from 'react-hook-form'

import { NetworkAlt as NetworkIcon, BoxIso as ImageIcon } from 'iconoir-react'
import { Stack, Checkbox, styled } from '@mui/material'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

import { Translate } from 'client/components/HOC'
import { STEP_ID as EXTRA_ID } from 'client/components/Forms/VmTemplate/InstantiateForm/Steps/ExtraConfiguration'
import { TAB_ID as STORAGE_ID } from 'client/components/Forms/VmTemplate/InstantiateForm/Steps/ExtraConfiguration/storage'
import { TAB_ID as NIC_ID } from 'client/components/Forms/VmTemplate/InstantiateForm/Steps/ExtraConfiguration/networking'
import { T } from 'client/constants'

const BootItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '0.5em',
  padding: '1em',
  marginBottom: '1em',
  backgroundColor: theme.palette.background.default
}))

const BootItemDraggable = styled(BootItem)(({ theme }) => ({
  '&:before': {
    content: "'.'",
    fontSize: 20,
    color: theme.palette.action.active,
    paddingBottom: 20,
    textShadow: `
      0 5px ${theme.palette.action.active},
      0 10px ${theme.palette.action.active},
      5px 0 ${theme.palette.action.active},
      5px 5px ${theme.palette.action.active},
      5px 10px ${theme.palette.action.active},
      10px 0 ${theme.palette.action.active},
      10px 5px ${theme.palette.action.active},
      10px 10px ${theme.palette.action.active}`
  }
}))

export const TAB_ID = 'OS.BOOT'

/**
 * @param {string} id - Resource id: 'NIC<index>' or 'DISK<index>'
 * @param {Array} list - List of resources
 * @param {object} formData - Form data
 * @param {SetStateAction} setFormData - React set state action
 */
export const reorderBootAfterRemove = (id, list, formData, setFormData) => {
  const type = String(id).toLowerCase().replace(/\d+/g, '') // nic | disk
  const getIndexFromId = id => String(id).toLowerCase().replace(type, '')
  const idxToRemove = getIndexFromId(id)

  const ids = list
    .filter(resource => resource.NAME !== id)
    .map(resource => String(resource.NAME).toLowerCase())

  const newBootOrder = [...formData?.OS?.BOOT?.split(',').filter(Boolean)]
    .filter(bootId => !bootId.startsWith(type) || ids.includes(bootId))
    .map(bootId => {
      if (!bootId.startsWith(type)) return bootId

      const resourceId = getIndexFromId(bootId)

      return resourceId < idxToRemove
        ? bootId
        : `${type}${resourceId - 1}`
    })

  reorder(newBootOrder, setFormData)
}

/**
 * @param {string[]} newBootOrder - New boot order
 * @param {SetStateAction} setFormData - React set state action
 */
const reorder = (newBootOrder, setFormData) => {
  setFormData(prev => ({
    ...prev,
    [EXTRA_ID]: {
      ...prev[EXTRA_ID],
      OS: { BOOT: newBootOrder.join(',') }
    }
  }))
}

const Booting = ({ data, setFormData, control }) => {
  const booting = useWatch({ name: `${EXTRA_ID}.${TAB_ID}`, control })
  const bootOrder = booting?.split(',').filter(Boolean) ?? []

  const disks = data?.[STORAGE_ID]
    ?.map((disk, idx) => {
      const isVolatile = !disk?.IMAGE && !disk?.IMAGE_ID

      return {
        ID: `disk${idx}`,
        NAME: (
          <>
            <ImageIcon />
            {isVolatile
              ? <>{`${disk?.NAME}: `}<Translate word={T.VolatileDisk} /></>
              : [disk?.NAME, disk?.IMAGE].filter(Boolean).join(': ')}
          </>
        )
      }
    }) ?? []

  const nics = data?.[NIC_ID]
    ?.map((nic, idx) => ({
      ID: `nic${idx}`,
      NAME: (
        <>
          <NetworkIcon />
          {[nic?.NAME, nic.NETWORK].filter(Boolean).join(': ')}
        </>
      )
    })) ?? []

  const enabledItems = [...disks, ...nics]
    .filter(item => bootOrder.includes(item.ID))
    .sort((a, b) => bootOrder.indexOf(a.ID) - bootOrder.indexOf(b.ID))

  const restOfItems = [...disks, ...nics]
    .filter(item => !bootOrder.includes(item.ID))

  /** @param {DropResult} result - Drop result */
  const onDragEnd = result => {
    const { destination, source, draggableId } = result
    const newBootOrder = [...bootOrder]

    if (
      destination &&
      destination.index !== source.index &&
      newBootOrder.includes(draggableId)
    ) {
      newBootOrder.splice(source.index, 1) // remove current position
      newBootOrder.splice(destination.index, 0, draggableId) // set in new position

      reorder(newBootOrder, setFormData)
    }
  }

  const handleEnable = itemId => {
    const newBootOrder = [...bootOrder]
    const itemIndex = bootOrder.indexOf(itemId)

    itemIndex >= 0
      ? newBootOrder.splice(itemIndex, 1)
      : newBootOrder.push(itemId)

    reorder(newBootOrder, setFormData)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack>
        <Droppable droppableId='booting'>
          {({ droppableProps, innerRef, placeholder }) => (
            <Stack {...droppableProps} ref={innerRef} m={2}>
              {enabledItems.map(({ ID, NAME }, idx) => (
                <Draggable key={ID} draggableId={ID} index={idx}>
                  {({ draggableProps, dragHandleProps, innerRef }) => (
                    <BootItemDraggable
                      {...draggableProps}
                      {...dragHandleProps}
                      ref={innerRef}
                    >
                      <Checkbox
                        checked
                        color='secondary'
                        data-cy={ID}
                        onChange={() => handleEnable(ID)}
                      />
                      {NAME}
                    </BootItemDraggable>
                  )}
                </Draggable>
              ))}
              {placeholder}
            </Stack>
          )}
        </Droppable>
        {restOfItems.map(({ ID, NAME }) => (
          <BootItem key={ID}>
            <Checkbox
              color='secondary'
              data-cy={ID}
              onChange={() => handleEnable(ID)}
            />
            {NAME}
          </BootItem>
        ))}
      </Stack>
    </DragDropContext>
  )
}

Booting.propTypes = {
  data: PropTypes.any,
  setFormData: PropTypes.func,
  hypervisor: PropTypes.string,
  control: PropTypes.object
}

Booting.displayName = 'Booting'

export default Booting
