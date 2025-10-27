import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, LoadingSpinner } from '@/components';

export default function DashboardWrapper({ children, wrapperData }) {
    return (
        <>
            {(!wrapperData.view || wrapperData.view === wrapperData.type) && (
                <Card
                    className={`${
                        !wrapperData.view ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''
                    }`}
                    category={wrapperData.type}
                >
                    <CardHeader>
                        <div className="flex flex-row items-center justify-between gap-4">
                            <CardTitle view={wrapperData.view}>{wrapperData.title}</CardTitle>
                            {wrapperData.view && (
                                <Button
                                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500 transition-all"
                                    onClick={() => wrapperData.openNewModal(wrapperData.modalData)}
                                >
                                    {wrapperData.buttonText}
                                </Button>
                            )}
                        </div>
                        <CardDescription view={wrapperData.view}>{wrapperData.description}</CardDescription>
                    </CardHeader>
                    <CardContent view={wrapperData.view}>
                        {wrapperData.loading && (
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner size="md" />
                            </div>
                        )}
                        {!wrapperData.loading && children}
                    </CardContent>
                </Card>
            )}
        </>
    );
}
