import { ReactNode } from 'react'
import Head from 'next/head'
import AnimationLayout from 'components/layouts/AnimationLayout'
import Navbar from 'components/Navbar'

const BaseLayout = ({ children }: { children: ReactNode }) => {

    return (
        <>
            <Head>
                <title>Blogg</title>
            </Head>
            <Navbar />
            <AnimationLayout>
                <main className="flex justify-center my-10 py-[5%] px-[10%] xl:px-[20%]">{children}</main>
            </AnimationLayout>
        </>
    )
}

export default BaseLayout
