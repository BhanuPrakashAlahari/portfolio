import { useState } from 'react';
import { ContactCard } from '@/components/ui/contact-card';
import { MailIcon, PhoneIcon, MapPinIcon, Loader2, Sparkles, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { BGPattern } from '@/components/ui/bg-pattern';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAiAutofill = () => {
        setIsAiLoading(true);
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                message: "Hi, I came across your portfolio and was impressed by your work. I'm looking for a skilled developer to collaborate on a project. I'd love to discuss how your expertise aligns with our goals. Looking forward to connecting with you!"
            }));
            setIsAiLoading(false);
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            // In Vercel deployment with rewrites, we can just use the relative path /api/contact
            // This works for both local dev (if proxy setup) and production
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                // Reset success message after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage('Failed to connect to server. Please try again later.');
        }
    };

    return (
        <section id="contact" className="py-12 px-4 md:py-24 md:px-6 relative flex justify-center items-center min-h-screen overflow-hidden">
            {/* Background Pattern */}
            <BGPattern variant="dots" mask="fade-y" size={20} fill="#444" className="opacity-20" />

            <div className="w-full max-w-6xl relative z-10">
                <ContactCard
                    title="Get in touch"
                    description="Have a project in mind or just want to say hi? Fill out the form below or reach out directly."
                    className="bg-black/60 border-white/10 backdrop-blur-xl shadow-2xl"
                    formSectionClassName="bg-white/5 border-white/10"
                    contactInfo={[
                        {
                            icon: MailIcon,
                            label: 'Email',
                            value: 'bhanuprakashalahari.04@gmail.com',
                            className: "text-gray-300"
                        },
                        {
                            icon: PhoneIcon,
                            label: 'Phone',
                            value: '+91 8500292426',
                            className: "text-gray-300"
                        },
                        {
                            icon: MapPinIcon,
                            label: 'Location',
                            value: 'India',
                            className: 'col-span-2 text-gray-300',
                        }
                    ]}
                >
                    <form className="w-full space-y-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name" className="text-gray-300 font-medium">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                className="bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:bg-white/10 transition-all font-light"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                className="bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:bg-white/10 transition-all font-light"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="message" className="text-gray-300 font-medium">Message</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAiAutofill}
                                    disabled={isAiLoading || status === 'loading'}
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-6 px-2 gap-1.5 disabled:opacity-50 transition-colors"
                                    title="Auto-fill with AI suggestion"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    <span>{isAiLoading ? 'Writing...' : 'Ask AI to write'}</span>
                                </Button>
                            </div>

                            {isAiLoading ? (
                                <div className="space-y-2 min-h-[120px] bg-white/5 border border-white/10 rounded-md p-3">
                                    <Skeleton className="h-4 w-3/4 bg-white/10" />
                                    <Skeleton className="h-4 w-full bg-white/10" />
                                    <Skeleton className="h-4 w-5/6 bg-white/10" />
                                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                                </div>
                            ) : (
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:bg-white/10 min-h-[120px] transition-all font-light"
                                    placeholder="How can I help you?"
                                />
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                className={cn(
                                    "w-full text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg",
                                    status === 'success' ? "bg-green-600 hover:bg-green-700 shadow-green-900/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20"
                                )}
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : status === 'success' ? (
                                    'Message Sent Successfully!'
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Let's connect
                                    </>
                                )}
                            </Button>

                            {status === 'error' && (
                                <p className="text-red-400 text-sm text-center mt-3 animate-pulse bg-red-900/20 py-2 rounded border border-red-500/20">
                                    {errorMessage}
                                </p>
                            )}
                        </div>
                    </form>
                </ContactCard>
            </div>
        </section>
    );
};

export default Contact;
