import { useRouter } from "next/router";
import MainLayout from '../layouts/main-layout';
import AdminLayout from '../layouts/admin-layout';

export default function Layout({ children }) {
    const router = useRouter();
    switch (router.pathname) {
        case '/auth':
        case '/page-edit':
        case '/page-edit/[[...pageUrl]]':
        case '/pages/[siteUrl]':
        case '/pages/[[...publicUrl]]':
            return children;
        case '/admin/overview':
        case '/admin/users':
        case '/admin/sites':
        case '/admin/pages':
        case '/admin/videos':
        case '/admin/videos/[uid]':
        case '/admin/settings':
            return (
                <AdminLayout>
                    {children}
                </AdminLayout>
            );
        case '/terms-and-conditions':
        case '/privacy-policy':
            return (
                <MainLayout footer={true}>
                    {children}
                </MainLayout>
            );
        default:
            return (
                <MainLayout>
                    {children}
                </MainLayout>
            );
    }
}
