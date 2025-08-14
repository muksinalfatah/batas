import { Card, Container, Divider, Group, NumberFormatter, Stack, Text, Title } from '@mantine/core'
import { useMemo } from 'react'
import { FeatureWithProperties } from '../types'


type Props = {
    feature: FeatureWithProperties
}


function FeatureDetailPopup({ feature }: Props) {
    const { properties } = feature

    const isKab = () => {
        return properties.KDPKAB.trim().length ? true : false;
    }
    
    const areaCode = useMemo(() => {
        return isKab() ? properties.KDPKAB : properties.KDPPUM;
    }, [properties])

    const areaName = useMemo(() => {
        return isKab() ? properties.WADMKK.replace("Kota ", "") : properties.WADMPR
    }, [properties])


    return (
        <Container>
            <Card>
                <Card.Section withBorder mb={"sm"} pb={"sm"}>
                    <Title order={2}>{`${isKab() ? "Kabupaten/Kota" : "Provinsi"} ${areaName}`}</Title>
                </Card.Section>
                <Card.Section>
                    <Stack gap={"xs"}>
                        <Group justify='space-between'>
                            <Text>Luas Wilayah Menurut Peraturan (HA)</Text>
                            <Text>
                                <NumberFormatter thousandSeparator value={parseFloat(properties.LUASWH)} />
                            </Text>
                        </Group>
                        <Divider />
                        <Group justify='space-between'>
                            <Text>Kode Wilayah</Text>
                            <Text>
                                {areaCode}
                            </Text>
                        </Group>
                        <Divider />
                        <Group justify='space-between'>
                            <Text>Spatial Reference Spatial Identifier</Text>
                            <Text>
                                {properties.SRS_ID}
                            </Text>
                        </Group>
                        <Divider />
                        <Group justify='space-between'>
                            <Text>Feature Code</Text>
                            <Text>
                                {properties.FCODE}
                            </Text>
                        </Group>
                        <Divider />
                        <Group justify='space-between'>
                            <Text>Catatan</Text>
                            <Text>
                                {properties.REMARK.trim().length ? properties.REMARK : "-"}
                            </Text>
                        </Group>
                    </Stack>
                </Card.Section>
            </Card>
        </Container>
    )
}

export default FeatureDetailPopup