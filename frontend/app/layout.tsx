

import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="min-h-full flex flex-col">
        <main>
        {children}
        </main>
        </body>
    </html>
  );
}


// public class alls{
//   public static int secondlar(int[] arr){
//     int largest= -Infinity;
//     int second= -Infininty;
//     for(int i = 0; i< arr.length; i++){
//       if(arr[i]>largest){
//         second=largest;
//         largest=arr[i];
//       }
//     }
//     return this.second;
//   }
//   public static void main(String args[]){
//     int[] arr = {1,2,3,4,5};
//     System.out.println(secondlar(arr));
//   }
// }
