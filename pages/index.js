import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches } from '@mantine/form';
import { Container, Stack, Button, Group, TextInput, NumberInput, Box, createStyles, Text } from '@mantine/core';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState } from 'react';
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';
import { API_URL } from '../services/request';
export default function Home() {
  const [user, setUser] = useState({
    phoneNumber: undefined,
    name: ''
  })
  const [click, setClick] = useState(0)
  const { classes } = useStyles()

  const submit = async () => {
    if (click >= 9) {
      showNotification({
        id: 'hello-there',
        autoClose: 3000,
        title: "So'rovlar soni limitdan ko'payib ketdi",
        message: 'Ma\'lumotlaringizni yuborish uchun web saytni qayta yuklang',
        color: 'red',
        icon: <IconX />,
        style: { backgroundColor: 'white' },
        loading: false,
      })
      return
    }
    if (user.phoneNumber && user.name && isPossiblePhoneNumber(`${user.phoneNumber}`)) {
      try {
        await fetch(`${API_URL}/api/user`, {
          method: 'POST',
          body: JSON.stringify({
            name: user.name,
            phoneNumber: `${user.phoneNumber}`,
            date: `${new Date(Date.now())}`
          }),
        }).then(() => {
          showNotification({
            title: 'Muvaffaqiyatli yakunlandi',
            message: 'Siz bilan tez orada bog\'lanamiz! ',
            autoClose: 3000,
            color: "green"
          })
          setClick((prev) => prev + 1)
        })
      }
      catch (error) {
        showNotification({
          id: 'hello-there',
          autoClose: 3000,
          title: "Hatolik",
          message: 'Dasturda xatolik',
          color: 'red',
          icon: <IconX />,
          style: { backgroundColor: 'white' },
          loading: false,
        })
      }

    } else {
      showNotification({
        id: 'hello-there',
        autoClose: 3000,
        title: "Xatolik",
        message: 'Ma\'lumotlarni to\'liq kiriting',
        color: 'red',
        icon: <IconX />,
        style: { backgroundColor: 'white' },
        loading: false,
      });
    }
  }
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Stack style={{ width: "100%" }}>
          <Box style={{ width: "100%" }} maw={400} mx="auto">
            <TextInput label="Ismingiz" max={40} maxLength={40} placeholder="Ismingizni kiriting" value={user.name} onChange={(e) => {
              setUser(p => {
                return { ...p, name: e.target.value }
              })
            }} />
            <Stack spacing={3} mt={20}>
              <Text size={'sm'}>
                Telefon raqamingiz
              </Text>
              <PhoneInput
                placeholder="+998 "
                defaultCountry='UZ'
                value={user.phoneNumber}
                onChange={(val) => {
                  setUser(p => {
                    return { ...p, phoneNumber: val }
                  })
                }}
                className={classes.phoneInput}
                error={user.phoneNumber ? (isValidPhoneNumber(user.phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'} />
            </Stack>
            <Group style={{ width: '100%' }} mt="md">
              <Button style={{ width: '100%' }} onClick={submit}>Yuborish</Button>
            </Group>
          </Box>
        </Stack>
      </Container>
    </div>
  )
}

const useStyles = createStyles((theme) => ({
  phoneInput: {
    width: '100%',
    // marginTop: 20,
    'input': {
      height: 36,
      borderRadius: 4,
      border: '1px solid #ced4da',
      padding: '0 15px',
      fontSize: 14,
      "::placeholder": {
        color: '#ced4da',
        fontSize: 14
      },
      ':focus': {
        border: '1px solid #ddd',
      },
      ':focus-visible': {
        border: '1px solid #ddd',
      },
      ':focus-within': {
        border: '1px solid #ddd',
      },
    }
  }
}))