import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import { Container, Stack, Button, createStyles, Table, Checkbox, ScrollArea, Group, Avatar, Text, TextInput, NumberInput, Box, Modal, Center, Pagination, } from '@mantine/core';
import Head from 'next/head'
import { useRouter } from 'next/router';
import React, { use, useEffect, useState } from 'react';
import 'react-phone-number-input/style.css'
import { API_URL } from '../services/request';
import { IconTrash, IconTrashX } from '@tabler/icons';
import * as dayjs from 'dayjs';

const useStyles = createStyles((theme) => ({
    userItem: {},
    userWrapper: {

    },
    userListHeader: {},
    rowSelected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}))

const Home = () => {

    const [hydrated, setHydrated] = React.useState(false);
    const [open, setOpen] = useState(false)
    const [activePage, setPage] = useState(1);
    const [amount, setAmount] = useState(0)
    const { classes, cx } = useStyles()
    const [data, setData] = useState([])
    const [selection, setSelection] = useState([]);
    const [delUserId, setDelUserId] = useState()
    const usersPerPage = 10
    const router = useRouter()
    const getData = async () => {

        let res = await fetch(`${API_URL}/api/user?${new URLSearchParams({
            currentPage: activePage,
            nPerPage: usersPerPage
        }).toString()}`, {
            method: 'GET',
            // body: JSON.stringify({ count: count, })
        });
        let dd = await res.json()
        console.log({ dd })

        setData(dd.message.users)
        setAmount(dd.message.count)
    }
    const deleteUser = async (userId) => {
        try {
            await fetch(`${API_URL}/api/user`, {
                method: 'DELETE',
                body: JSON.stringify(delUserId),
            }).then(() => {
                setPage(activePage)
                closeModal()
                // router.reload()
            });
            // return router.push(router.asPath);
        } catch (error) {
            console.log({ error })
        }
    };
    React.useEffect(() => {
        const ad = prompt('Admin parolini kiriting')
        if (ad !== 'adminx1!') {
            router.back()
        }
        setHydrated(true);
        getData()
    }, []);

    React.useEffect(() => {
        getData()
    }, [setPage, setDelUserId, delUserId, open, activePage]);

    if (!hydrated) {
        return null;
    }

    const openModal = (e) => {
        console.log({ id: e })
        setOpen(true)
        setDelUserId(e)
    }
    console.log({ delUserId })
    const closeModal = () => setOpen(false)


    const changePage = (page) => {
        setPage(page)
    }
    // console.log({ selection })
    // const toggleRow = (id) => {
    //     setSelection((current) =>
    //         current?.includes(id) ? current?.filter((item) => item !== id) : [...current, id]
    //     );
    // }
    // const toggleAll = () => {
    //     setSelection((current) => (current?.length === data?.length ? [] : data?.map((item) => item._id)));
    // }
    console.log({ data })

    const Rows = () => {
        return data?.map((item, index) => {
            console.log(item?._id)
            // const selected = selection.includes(item?._id);
            // console.log({ selected, item })
            return (
                <tr
                    key={item?._id}
                // className={cx({ [classes.rowSelected]: selected })}
                >
                    {/* <td>
                    <Checkbox
                        checked={selection?.includes(item?._id)}
                        onChange={() => {
                            toggleRow(item?._id)
                        }}
                        transitionDuration={0}
                    />
                </td> */}
                    <td>
                        <Text align='center' size="sm" weight={500}>
                            {(activePage - 1) * 10 + index + 1}
                        </Text>
                    </td>
                    <td>
                        <Text align='center' size="sm" weight={500}>
                            {item?.name}
                        </Text>
                    </td>
                    <td>
                        <Text align='center' size="sm" weight={500}>
                            {item?.phoneNumber}
                        </Text>
                    </td>
                    <td>
                        <Text align='center' size="sm" weight={500}>
                            {dayjs(item?.date).locale('uz-uz').format('HH:mm:ss  DD MMMM YYYY yil')}
                        </Text>
                    </td>
                    <td>
                        <Center>
                            <Button onClick={() => { openModal(item._id) }} rightIcon={<IconTrash></IconTrash>} color={'red'}>O'chirish</Button>
                        </Center>
                    </td>
                    <Modal title="Ushbu foydalanuvchi ma'lumotlarini o'chirishga rozimisiz" overlayOpacity={0.3} centered onClose={closeModal} opened={open}>
                        <Stack align={'center'}>
                            {/* <Text align='center'>Ushbu foydalanuvchi ma'lumotlarini o'chirishga rozimisiz</Text> */}
                            <Group>
                                <Button onClick={closeModal} color={'gray'}>Bekor qilish</Button>
                                <Button onClick={async () => { await deleteUser(item?._id) }} rightIcon={<IconTrashX></IconTrashX>} color={'red'}>O'chirish</Button>
                            </Group>
                        </Stack>
                    </Modal>
                </tr>
            );
        });
    }
    return (data ?
        <div>
            <Head>
                <title>Admin panel</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container size={'md'}>
                <ScrollArea mt={20}>
                    <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                        <thead>
                            <tr style={{ background: '#eee' }}>
                                {/* <th style={{ width: 40 }}>
                                    <Checkbox
                                        onChange={toggleAll}
                                        checked={selection.length === data?.length}
                                        indeterminate={selection.length > 0 && selection?.length !== data?.length}
                                        transitionDuration={0}
                                    />
                                </th> */}
                                <th style={{ textAlign: 'center' }}>No</th>
                                <th style={{ textAlign: 'center' }}>Ismi</th>
                                <th style={{ textAlign: 'center' }}>Telefon raqami</th>
                                <th style={{ textAlign: 'center' }}>Sanasi</th>
                                <th style={{ textAlign: 'center' }}>O'chirish</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Rows />
                        </tbody>
                    </Table>
                </ScrollArea>
                <Stack style={{ width: "100%" }}>
                    {/* <Box>
                        {data.map((item) => {
                            return <Stack className={classes.userItem} key={item?._id}>
                                <Group>
                                    <Text>Ismi</Text>
                                    <Text>{item?.name}</Text>
                                </Group>
                                <Group>
                                    <Text>Telefon raqami</Text>
                                    <Text>{item?.phoneNumber}</Text>
                                </Group>
                            </Stack>
                        })}
                    </Box> */}
                </Stack>
                {<Pagination my={20} position='center' page={activePage} onChange={(n) => changePage(n)} total={Math.ceil(amount / 10)} />}
            </Container>
        </div> : 'Yuklanmoqda...'
    )
}


// export async function getServerSideProps(context, routes) {
//     // console.log({ context, nodeEnv: process.env.NODE_ENV, routes })
//     try {
//         let res = await fetch(`${API_URL}/api/user`, {
//             method: 'GET',
//         });
//         let data = await res.json()
//         // console.log({ data: data.message }, 'ressss')

//         return {
//             props: { data: data.message },
//         }
//     } catch (e) {
//         console.error(e)
//         return {
//             props: { isConnected: false },
//         }
//     }
// }

export default Home