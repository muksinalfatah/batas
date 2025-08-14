import { useState } from 'react'
import { Area } from '../types';
import { Text } from '@mantine/core';
import AreaDetail from './AreaDetail';

function AreaDetailPopup() {
    const [isLoading] = useState(true);
    const [area] = useState<Area>();

  if (isLoading) {
    return (<Text>Loading</Text>)
  }

  if (area) {
    return <AreaDetail {...area} />
  }

  return null;
}

export default AreaDetailPopup