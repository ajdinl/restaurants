import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@/components'

export default function DashboardWrapper({ children, wrapperData }) {
  return (
    <>
      {(!wrapperData.view || wrapperData.view === wrapperData.type) && (
        <Card className={`${!wrapperData.view ? 'cursor-pointer' : ''}`}>
          <CardHeader>
            <div className='flex flex-row items-center justify-between'>
              <CardTitle view={wrapperData.view}>{wrapperData.title}</CardTitle>
              {wrapperData.view && (
                <Button
                  className='bg-green-500 hover:bg-green-600 text-white'
                  onClick={() =>
                    wrapperData.openNewModal(wrapperData.modalData)
                  }
                >
                  {wrapperData.buttonText}
                </Button>
              )}
            </div>
            <CardDescription view={wrapperData.view}>
              {wrapperData.description}
            </CardDescription>
          </CardHeader>
          <CardContent view={wrapperData.view}>
            {wrapperData.loading && (
              <div className='text-left text-gray-500'>Loading...</div>
            )}
            {children}
          </CardContent>
        </Card>
      )}
    </>
  )
}
