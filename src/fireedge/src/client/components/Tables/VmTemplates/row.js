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
import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { User, Group, Lock } from 'iconoir-react'
import { Typography } from '@mui/material'

import { StatusChip } from 'client/components/Status'
import { rowStyles } from 'client/components/Tables/styles'
import Image from 'client/components/Image'

import * as Helper from 'client/models/Helper'
import { isExternalURL } from 'client/utils'
import { LOGO_IMAGES_URL } from 'client/constants'

const Row = ({ original, value, ...props }) => {
  const classes = rowStyles()
  const { ID, NAME, UNAME, GNAME, REGTIME, LOCK, VROUTER, LOGO = '' } = value

  const [logoSource] = useMemo(() => {
    const external = isExternalURL(LOGO)
    const cleanLogoAttribute = String(LOGO).split('/').at(-1)
    const src = external ? LOGO : `${LOGO_IMAGES_URL}/${cleanLogoAttribute}`

    return [src, external]
  }, [LOGO])

  const time = Helper.timeFromMilliseconds(+REGTIME)
  const timeAgo = `registered ${time.toRelative()}`

  return (
    <div {...props}>
      <div className={classes.figure}>
        <Image
          src={logoSource}
          imgProps={{ className: classes.image }}
        />
      </div>
      <div className={classes.main}>
        <div className={classes.title}>
          <Typography component='span'>
            {NAME}
          </Typography>
          <span className={classes.labels}>
            {LOCK && <Lock />}
            {VROUTER && <StatusChip text={VROUTER} />}
          </span>
        </div>
        <div className={classes.caption}>
          <span title={time.toFormat('ff')} className='full-width'>
            {`#${ID} ${timeAgo}`}
          </span>
          <span title={`Owner: ${UNAME}`}>
            <User />
            <span>{` ${UNAME}`}</span>
          </span>
          <span title={`Group: ${GNAME}`}>
            <Group />
            <span>{` ${GNAME}`}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

Row.propTypes = {
  original: PropTypes.object,
  value: PropTypes.object,
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func
}

export default Row
