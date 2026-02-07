import { useGetVersion } from '@/src/api'
import { getAppVersion } from '@/src/utils'
import { useEffect, useState } from 'react'
import semver from 'semver'

export function useVersion() {
  const { data, isLoading } = useGetVersion()
  const [updateInfo, setUpdateInfo] = useState({
    forceUpdate: false,
    optionalUpdate: false,
  })
  const currentVersion = getAppVersion()

  useEffect(() => {
    if (isLoading || !data) {
      return
    }

    if (semver.lt(currentVersion, data.min_version)) {
      // 強制更新
      setUpdateInfo({
        forceUpdate: true,
        optionalUpdate: false,
      })
    } else if (semver.lt(currentVersion, data.version)) {
      // 可選更新
      setUpdateInfo({
        forceUpdate: false,
        optionalUpdate: true,
      })
    }
  }, [data, isLoading])

  return { updateInfo }
}
