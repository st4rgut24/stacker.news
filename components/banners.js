import Alert from 'react-bootstrap/Alert'
import styles from './banners.module.css'
import { useEffect, useState } from 'react'
import { useMe } from '../components/me'
import { useMutation } from '@apollo/client'
import { WELCOME_BANNER_MUTATION } from '../fragments/users'
import { useToast } from '../components/toast'

export default function WelcomeBanner () {
  const me = useMe()
  const toaster = useToast()
  const [hidden, setHidden] = useState(true)
  const handleClose = async () => {
    window.localStorage.setItem('hideWelcomeBanner', true)
    setHidden(true)
    if (me) {
      try {
        await hideWelcomeBanner()
      } catch (err) {
        console.log(err)
        toaster.danger('mutation failed')
      }
    }
  }
  const [hideWelcomeBanner] = useMutation(WELCOME_BANNER_MUTATION, {
    update (cache) {
      cache.modify({
        id: `User:${me.id}`,
        fields: {
          hideWelcomeBanner () {
            return true
          }
        }
      })
    }
  })
  useEffect(() => {
    setHidden(me?.privates?.hideWelcomeBanner || (!me && window.localStorage.getItem('hideWelcomeBanner')))
  }, [me?.privates?.hideWelcomeBanner])

  if (hidden) return

  return (
    <Alert className={styles.banner} key='info' variant='info' onClose={handleClose} dismissible>
      <Alert.Heading>
        👋 Welcome to Stacker News!
      </Alert.Heading>
      <p>
        To get started, check out our{' '}
        <Alert.Link href='/faq'>FAQs</Alert.Link> or{' '}
        <Alert.Link href='/guide'>content guidelines</Alert.Link>, or go ahead and{' '}
        {
          me
            ? (
              <Alert.Link href='/post'>make a post</Alert.Link>
              )
            : (
              <>
                <Alert.Link href='/signup'>sign up</Alert.Link> or create an{' '}
                <Alert.Link href='/post'>anonymous post</Alert.Link>
              </>
              )
        }.
      </p>
    </Alert>
  )
}
