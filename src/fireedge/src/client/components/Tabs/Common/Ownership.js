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
import { memo } from 'react'
import PropTypes from 'prop-types'
import { generatePath } from 'react-router-dom'

import { useUserApi, useGroupApi, RESOURCES } from 'client/features/One'
import { List } from 'client/components/Tabs/Common'
import { T, SERVERADMIN_ID, ACTIONS } from 'client/constants'
import { PATH } from 'client/apps/sunstone/routesOne'

const Ownership = memo(({
  actions,
  groupId,
  groupName,
  handleEdit,
  userId,
  userName
}) => {
  const { getUsers } = useUserApi()
  const { getGroups } = useGroupApi()

  const getUserOptions = async () => {
    const response = await getUsers()

    return response
      ?.[RESOURCES.user]
      ?.filter?.(({ ID } = {}) => ID !== SERVERADMIN_ID)
      ?.map?.(({ ID, NAME } = {}) => ({ text: NAME, value: ID })
      )
  }

  const getGroupOptions = async () => {
    const response = await getGroups()

    return response
      ?.[RESOURCES.group]
      ?.map?.(({ ID, NAME } = {}) => ({ text: NAME, value: ID })
      )
  }

  const ownership = [
    {
      name: T.Owner,
      value: userName,
      valueInOptionList: userId,
      link: generatePath(PATH.SYSTEM.USERS.DETAIL, { id: userId }),
      canEdit: actions?.includes?.(ACTIONS.CHANGE_OWNER),
      handleGetOptionList: getUserOptions,
      handleEdit: (_, user) => handleEdit?.({ user })
    },
    {
      name: T.Group,
      value: groupName,
      valueInOptionList: groupId,
      link: generatePath(PATH.SYSTEM.GROUPS.DETAIL, { id: groupId }),
      canEdit: actions?.includes?.(ACTIONS.CHANGE_GROUP),
      handleGetOptionList: getGroupOptions,
      handleEdit: (_, group) => handleEdit?.({ group })
    }
  ]

  return (
    <List title={T.Ownership} list={ownership} />
  )
})

Ownership.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  handleEdit: PropTypes.func
}

Ownership.displayName = 'Ownership'

export default Ownership
