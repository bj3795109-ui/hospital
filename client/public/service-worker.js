/* Service Worker: handle push events and show notifications */
self.addEventListener('push', function (event) {
  try {
    const data = event.data ? event.data.json() : {}
    const title = data.title || 'Reminder'
    const options = {
      body: data.body || '',
      data: data.data || {},
      tag: data.data?.medId ? `med-${data.data.medId}` : undefined,
      renotify: true,
    }
    event.waitUntil(self.registration.showNotification(title, options))
  } catch (e) {
    console.error('Push event error', e)
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        const client = clientList[0]
        return client.focus()
      }
      return clients.openWindow('/')
    })
  )
})
