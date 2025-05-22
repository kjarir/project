import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic documentation hosting for personal projects',
    features: [
      'Up to 3 documentation sites',
      'Public repositories only',
      'GitDocify subdomain',
      'Basic themes',
      'Community support',
    ],
    cta: 'Get Started',
    ctaLink: '/login',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'Advanced features for teams and professionals',
    features: [
      'Unlimited documentation sites',
      'Private repositories',
      'Custom domain support',
      'Advanced themes and customization',
      'Analytics and visitor tracking',
      'Email support',
    ],
    cta: 'Subscribe Now',
    ctaLink: '/login',
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    description: 'Collaborative documentation for organizations',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom branding',
      'Access control',
      'Version history',
      'Priority support',
      'API access',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that's right for you and start creating beautiful documentation.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? 'border-primary shadow-md relative' : ''}>
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="text-primary h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Contact our sales team for enterprise options with custom integrations,
          dedicated support, and tailored solutions for your organization.
        </p>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>

      <div className="mt-20 border-t pt-12">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Do you offer a free trial?</h3>
            <p className="text-muted-foreground">
              Yes, all paid plans come with a 14-day free trial, no credit card required.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">How does billing work?</h3>
            <p className="text-muted-foreground">
              We offer monthly and annual billing options. Annual plans come with a 20% discount.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards and PayPal. For Team and Enterprise plans, we also offer invoice payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}