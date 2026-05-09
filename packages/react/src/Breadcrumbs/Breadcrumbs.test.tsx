import { render } from "../../test-utils/render";
import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";

describe("Breadcrumbs Component", () => {
  const items: BreadcrumbItem[] = [
    { label: "Reports", href: "/reports" },
    { label: "Course reports", href: "/course" },
    { label: "Introduction to TLMS+" }, // Current page, no href
  ];

  it("renders the correct number of breadcrumb items", () => {
    const { getByText } = render(<Breadcrumbs items={items} />);

    expect(getByText("Reports")).toBeInTheDocument();
    expect(getByText("Course reports")).toBeInTheDocument();
    expect(getByText("Introduction to TLMS+")).toBeInTheDocument();
  });

  it("renders links with correct href attributes", () => {
    const { getByText } = render(<Breadcrumbs items={items} />);

    const reportsLink = getByText("Reports");
    const courseReportsLink = getByText("Course reports");

    expect(reportsLink).toHaveAttribute("href", "/reports");
    expect(courseReportsLink).toHaveAttribute("href", "/course");
  });

  it("highlights the current item when highlightActivePage is true", () => {
    const { getByText } = render(<Breadcrumbs items={items} highlightActivePage={true} />);

    const currentItem = getByText("Introduction to TLMS+");
    expect(currentItem).toHaveAttribute("aria-current", "page");
    expect(currentItem.closest("li")).toHaveClass("eg-breadcrumbs__item--current");
  });

  it("renders the separator between items", () => {
    const { getByTestId } = render(<Breadcrumbs items={items} />);

    const arrowIcons = getByTestId("breadcrumbs").querySelectorAll("[data-testid='arrow-icon']");
    expect(arrowIcons.length).toBe(2);
  });

  it("uses the default aria-label for the nav element", () => {
    const { container } = render(<Breadcrumbs items={items} />);

    const nav = container.querySelector("nav");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb navigation");
  });

  it("uses custom aria-label for the nav element", () => {
    const { container } = render(
      <Breadcrumbs items={items} navAriaLabel="Custom navigation label" />,
    );

    const nav = container.querySelector("nav");
    expect(nav).toHaveAttribute("aria-label", "Custom navigation label");
  });

  it("uses the custom link aria-label function", () => {
    const customLinkAriaLabel = (label: string) => `Navigate to ${label}`;
    const { getByText } = render(<Breadcrumbs items={items} linkAriaLabel={customLinkAriaLabel} />);

    const reportsLink = getByText("Reports");
    expect(reportsLink).toHaveAttribute("aria-label", "Navigate to Reports");
  });
});
